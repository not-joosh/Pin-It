/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*  SOUNDS USED AND ASSET IMAGES ARE NOT MINE. MUCH APPRECIATION TO THE CREATORS :))
*  Proper Credits to:
*      lofiSongs: 
*          https://www.youtube.com/watch?v=NsImQYDW8IA&ab_channel=N3N4Me
*          https://www.youtube.com/watch?v=AzV77KFsLn4&ab_channel=thebootlegboy
*      OnlineTutorials | Youtube Channel:  https://www.youtube.com/@OnlineTutorialsYT
*      Image Attribution
*      Image Source : https://www.freepik.com
*      Image by upklyak on Freepik
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/*
* Route Imports
*/
import { CREATEQUIZ, ERRORROUTE, HOME, LANDINGPAGE, STARTQUIZ, VIEWQUIZ } from './lib/routes';
/*
* Page Imports
*/
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { CreateQuizPage } from './pages/CreateQuizPage';
import { StartQuizPage } from './pages/StartQuizPage';
import { ViewQuizPage } from './pages/ViewQuizPage';

/*
* Other Imports
*/
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { ErrorPage } from './pages/ErrorPage';


function App() {  
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path = {LANDINGPAGE} element = {<LandingPage />}/>
          <Route path = {HOME} element = {<HomePage />}/>
          <Route path = {CREATEQUIZ} element = {<CreateQuizPage />}/>
          <Route path = {STARTQUIZ} element = {<StartQuizPage />}/>
          <Route path = {VIEWQUIZ} element = {<ViewQuizPage />}/>
          <Route path = {ERRORROUTE} element = {<ErrorPage />}/>
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App
