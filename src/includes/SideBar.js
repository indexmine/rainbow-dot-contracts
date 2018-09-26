import React from 'react'
import classnames from 'classnames';
import { history } from '../store'

const hashToActive = (id) => {
  if (history.location.hash) {
    return history.location.hash === id ? 'active': '';
  } else if(history.location.hash === '') {
    return id === '#intro' ? 'active' : '';
  }
}

const SideBar = ({menus}) => {
  return (
      <section id="sidebar">
        <div className="inner">
          <nav>
            <ul>
              {
                menus.map(item=>{
                  let key = `#${item.key}`;
                  return (<li><a href={key} className={classnames('srolly', hashToActive(key))}>{item.title}</a></li>)
                })
              }
            </ul>
          </nav>
        </div>
      </section>
)};
export default SideBar;
