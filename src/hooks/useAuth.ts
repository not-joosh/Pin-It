import { useState } from "react";
import { auth } from "../store/firebaseConfig";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, signInWithEmailAndPassword, signOut } from "@firebase/auth";
import { useNavigate } from "react-router";
import { userRef } from "../store/firebaseConfig";
import { getDocs, QuerySnapshot, DocumentData, query, where, setDoc, doc } from "firebase/firestore";
import { useToast } from '@chakra-ui/react';

interface UserInformation {
  username: string;
  email: string;
}

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useToast();
    const navigate = useNavigate();

    const tryLogin = async ( usernameOrEmail: string, password: string, redirectTo: string) => {
        try {
            setIsLoading(true);
            let userUid = localStorage.getItem("userUid");

            if (usernameOrEmail.includes("@")) {
                const { user } = await signInWithEmailAndPassword(auth, usernameOrEmail, password);
                userUid = user.uid; // Updating user UID if available
            } else {
                // Otherwise, we search for the user in the 'userAssets' collection
                const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(userRef);
                let email = null;
                querySnapshot.forEach((doc) => {
                    const userData = doc.data() as UserInformation;
                    if (userData.username === usernameOrEmail) email = userData.email;
                });
                if (email) {
                    const { user } = await signInWithEmailAndPassword(auth, email, password);
                    userUid = user.uid; // Updating user UID if available
                } else {
                    throw new Error(`Unable to find the user '${usernameOrEmail}'.`);
                }
            }
            localStorage.setItem("userUid", userUid); // Store user UID in local storage
            toast({
                title: 'Successfully Logged In!',
                status: 'success',
                isClosable: true,
                position: 'top',
                duration: 3000,
            });
            navigate(redirectTo);
        } catch (error: unknown) {
            if (error instanceof Error) 
                toast({
                    title: 'Login failed!',
                    status: 'error',
                    isClosable: true,
                    position: 'top',
                    description: error.message,
                    duration: 3000,
                });
        } finally {
            setIsLoading(false);
        }
    };
    const tryRegister = async(email: string, username: string, password: string, fullName: string, redirectTo: string) => {
        try {
            setIsLoading(true);
            // Check if the email and username are already in use
            const emailIsValid = await isAvailableEmail(email);
            const usernameIsValid = await isAvailableUsername(username);
            if(!emailIsValid) 
                throw new Error('Email address is already in use.');
            if(!usernameIsValid)
                throw new Error('Username is already taken.');
            // Creating the Account and Saving it to the database
            await createUserWithEmailAndPassword(auth,email, password);
            await saveUserToDatabase(email, password, username, fullName);
            signInWithEmailAndPassword(auth, email, password);
            toast({
                title: 'Successfully Registered!',
                status: 'success',
                isClosable: true,
                position: 'top',
                duration: 3000,
            });
            navigate(redirectTo);
        } catch(error: unknown) {
            if(error instanceof Error)
                toast({
                    title: 'Registration failed!',
                    status: 'error',
                    isClosable: true,
                    position: 'top',
                    description: error.message,
                    duration: 3000,
                });
        } finally {
            setIsLoading(false);
        }
    };

    const tryLogout = async(redirectTo: string) => {
        try {
            await signOut(auth);
            toast({
                title: 'Successfully Logged Out!',
                status: 'success',
                isClosable: true,
                position: 'top',
                duration: 3000, 
            });
            localStorage.clear();
            navigate(redirectTo);
        } catch(error: unknown) {
            if(error instanceof Error) 
                toast({
                    title: 'Logout failed!',
                    status: 'error',
                    isClosable: true,
                    position: 'top',
                    description: error.message,
                    duration: 3000,
                });
        }
    };

    return { tryLogin, tryLogout, tryRegister, isLoading };
};

export const saveUserToDatabase = async (email: string, password: string, username: string, fullName: string) => {
    try {
        // Create user account with email and password
        await signInWithEmailAndPassword(auth, email, password);
        // Save user details to the userAssets collection and match the uid with docid
        const newAccountDoc = doc(userRef, auth.currentUser?.uid);
        await setDoc(newAccountDoc, {
            username: username,
            email: email,
            fullName: fullName,
            id: auth.currentUser?.uid,
            quizzes: []
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            throw new Error('Failed to create user account or save user details.');
        }
    };
};

export const isAvailableEmail = async (email: string): Promise<boolean> => {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    if (signInMethods.length > 0) return false;
    else return true;
};

export const isAvailableUsername = async (userName: string): Promise<boolean> => {
    const querySnapshot = await getDocs(query(userRef, where("username", "==", userName)));
    if (!querySnapshot.empty) return false;
    else return true;
};