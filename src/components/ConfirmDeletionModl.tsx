import '../stylesheets/ConfirmatDeletionModalStyle.css';
interface ConfirmationModalProps {
  quizName: string;
  handleExit: (exitBool: boolean) => void;
  handleConfirmation: (quizName: string) => void;
}

export const ConfirmDeletionModal = ({ quizName, handleConfirmation, handleExit }: ConfirmationModalProps) => {
    return (
        <>
            <div className="modalContents">
                <div>
                    Are you sure you would like to delete <span>{`"${quizName}"`}</span>?
                </div>
                <div className="modalButtons">
                    <button className="confirmButton" onClick={() => handleConfirmation(quizName)}>
                        CONFIRM
                    </button>
                    <button className="cancelButton" onClick={() => handleExit(false)}>
                        CANCEL
                    </button>
                </div>
            </div>
        </>
    );
};