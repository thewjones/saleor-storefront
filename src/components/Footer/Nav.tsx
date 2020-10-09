import * as React from "react";

import Mailchimp from 'react-mailchimp-form'
import { NavLink, SocialMediaIcon } from "..";
import { SOCIAL_MEDIA } from "../../core/config";
import { TypedSecondaryMenuQuery } from "./queries";

import "./scss/index.scss";
import selogo from "./se-one-line.png";

class Nav extends React.PureComponent {
  render() {
return (


      <footer className="footer-nav">
        <div className="container">
          <div className="footer-nav__section">
            <h4 className="footer-nav__section-header">
              <img src={selogo}/></h4>
            <div className="footer-nav__section-content">

              <p>&copy; All rights reserved<br/><strong>Clever Crow Cycleworks Ltd.</strong><br/> Company number 123321331</p>
              <p>Designed by <a href="https://stridestudio.co.uk">Stride</a></p>
            </div>

          </div>

          <TypedSecondaryMenuQuery>
            {({ data }) => {
              return data.shop.navigation.secondary.items.map(item => (
            <div className="footer-nav__section" key={item.id}>
              <h4 className="footer-nav__section-header">
                <NavLink item={item} />
              </h4>
              <ul className="footer-nav__section-content">
                {item.children.map(subItem => (
                <li key={subItem.id}><NavLink item={subItem} /></li>
                ))}
              </ul>
            </div>
            ));
            }}
          </TypedSecondaryMenuQuery>
          <div className="footer-nav__section">
            <h4 className="footer-nav__section-header">
              Subscribe</h4>
            <div className="footer-nav__section-content subscribe">

        <Mailchimp
        action='https://clevercrow.us2.list-manage.com/subscribe/post?u=58190ed642afe1b532ccbe134&amp;id=9cfc78fe49'
        fields={[
          {
            name: 'EMAIL',
            placeholder: 'Email',
          required: true,
          type: 'email',

          },
          ]}
          messages = {
          {
          button: "Go!",
          duplicate: "Too many subscribe attempts for this email address",
          empty: "You must write an e-mail.",
          error: "An unexpected internal error has occurred.",
          sending: "Sending...",
          success: "Thank you for subscribing!",
          }
          }
        />
<p>We’ll occasionally email you offers,
updates and workshop tales.</p>

            </div>

          </div>

        </div>
        <div className="container">
           <div className="footer__favicons container">
      {SOCIAL_MEDIA.map(medium => (
        <SocialMediaIcon medium={medium} key={medium.ariaLabel} />
      ))}
    </div>
</div>
      </footer>
    );
  }
}

export default Nav;
