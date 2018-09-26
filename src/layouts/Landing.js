import React from 'react'
import SideBar from '../includes/SideBar';
import NavBar from '../includes/NavBar';

const Landing = ({ contents }) =>  {

  return (
      <div>
        <NavBar/>
        <SideBar menus={
          contents.map(item=>(
              {
                key: item.key,
                title: item.title
              }
          ))
        }/>
        <div id="wrapper">
          { contents.map(item=>item.content)}
        </div>
      </div>);
};

export default Landing;
