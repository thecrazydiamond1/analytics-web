import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainDashboard from './components/mainDashboard';
import DirectList from './components/directListGraphQl';
import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
import Login from './components/logIn';
import ProtectedRoute from './components/context/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const client =new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
});
const App = ()=>{
  return(
    <>
      <Routes>
        <Route element={<ProtectedRoute/>}>
          <Route path="/maindashboard" element= {<MainDashboard/>}/>
        </Route>
        <Route path="*" element= {<Login/>}/>
        <Route path="/directlist" element={
          <ApolloProvider client={client}>
            <DirectList/>
          </ApolloProvider>
          }/>
      </Routes>
     <ToastContainer position="top-right" autoClose={3000} />
    </>
  )


}
export default App;