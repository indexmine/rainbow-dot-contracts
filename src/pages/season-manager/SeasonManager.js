import React from 'react'
import Landing from '../../layouts/Landing';
import classnames from 'classnames';
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components'

const SeasonManager = ({
                  accounts,
                  // SeasonManagerContract,
                  // SeasonManagerContract2,
                  drizzleStatus
                }
) =>  {
  const contents = [
    {
      key: 'intro',
      title: 'Welcome',
      content: (
          <section id="intro" className="wrapper style1 fullscreen">
            <div className="inner">
              <h1>Rainbow dot</h1>
              <p>Phasellus convallis elit id ullamcorper pulvinar.
                Duis aliquam turpis mauris, eu ultricies erat malesuada quis.
                Aliquam dapibus.</p>
              <ul className="actions">
                <li><a href="#one" className="button scrolly">Learn more</a></li>
              </ul>
            </div>
          </section>
      )},
    {
      key: 'one',
      title: 'Sed ipsum dolor?',
      content: (
          <section id="one" className="wrapper style2 spotlights">
            <section>
              <a href="#" className="image"><img src="images/pic01.jpg" alt="" data-position="center center" /></a>
              <div className="content">
                <div className="inner">
                  <h2>Sed ipsum dolor</h2>
                  <p>Phasellus convallis elit id ullamcorper pulvinar. Duis aliquam turpis mauris, eu ultricies erat malesuada quis. Aliquam dapibus.</p>
                  <ul className="actions">
                    <li><a href="generic.html" className="button">Learn more</a></li>
                  </ul>
                </div>
              </div>
            </section>
            <section>
              <a href="#" className="image"><img src="images/pic02.jpg" alt="" data-position="top center" /></a>
              <div className="content">
                <div className="inner">
                  <h2>Feugiat consequat</h2>
                  <p>Phasellus convallis elit id ullamcorper pulvinar. Duis aliquam turpis mauris, eu ultricies erat malesuada quis. Aliquam dapibus.</p>
                  <ul className="actions">
                    <li><a href="generic.html" className="button">Learn more</a></li>
                  </ul>
                </div>
              </div>
            </section>
            <section>
              <a href="#" className="image"><img src="images/pic03.jpg" alt="" data-position="25% 25%" /></a>
              <div className="content">
                <div className="inner">
                  <h2>Ultricies aliquam</h2>
                  <p>Phasellus convallis elit id ullamcorper pulvinar. Duis aliquam turpis mauris, eu ultricies erat malesuada quis. Aliquam dapibus.</p>
                  <ul className="actions">
                    <li><a href="generic.html" className="button">Learn more</a></li>
                  </ul>
                </div>
              </div>
            </section>
          </section>
      )},
    {
      key: 'two',
      title: 'What we do',
      content: (
          <section id="two" className="wrapper style3 fade-up">
            <div className="inner">
              <h2>What we do</h2>
              <p>Phasellus convallis elit id ullamcorper pulvinar. Duis aliquam turpis mauris, eu ultricies erat malesuada quis. Aliquam dapibus, lacus eget hendrerit bibendum, urna est aliquam sem, sit amet imperdiet est velit quis lorem.</p>
              <div className="features">
                <section>
                  <span className="icon major fa-code"></span>
                  <h3>Lorem ipsum amet</h3>
                  <p>Phasellus convallis elit id ullam corper amet et pulvinar. Duis aliquam turpis mauris, sed ultricies erat dapibus.</p>
                </section>
                <section>
                  <span className="icon major fa-lock"></span>
                  <h3>Aliquam sed nullam</h3>
                  <p>Phasellus convallis elit id ullam corper amet et pulvinar. Duis aliquam turpis mauris, sed ultricies erat dapibus.</p>
                </section>
                <section>
                  <span className="icon major fa-cog"></span>
                  <h3>Sed erat ullam corper</h3>
                  <p>Phasellus convallis elit id ullam corper amet et pulvinar. Duis aliquam turpis mauris, sed ultricies erat dapibus.</p>
                </section>
                <section>
                  <span className="icon major fa-desktop"></span>
                  <h3>Veroeros quis lorem</h3>
                  <p>Phasellus convallis elit id ullam corper amet et pulvinar. Duis aliquam turpis mauris, sed ultricies erat dapibus.</p>
                </section>
                <section>
                  <span className="icon major fa-chain"></span>
                  <h3>Urna quis bibendum</h3>
                  <p>Phasellus convallis elit id ullam corper amet et pulvinar. Duis aliquam turpis mauris, sed ultricies erat dapibus.</p>
                </section>
                <section>
                  <span className="icon major fa-diamond"></span>
                  <h3>Aliquam urna dapibus</h3>
                  <p>Phasellus convallis elit id ullam corper amet et pulvinar. Duis aliquam turpis mauris, sed ultricies erat dapibus.</p>
                </section>
              </div>
              <ul className="actions">
                <li><a href="generic.html" className="button">Learn more</a></li>
              </ul>
            </div>
          </section>
      )}
  ];
  return (<Landing contents={contents}/>)
};

export default SeasonManager
