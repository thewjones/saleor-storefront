import * as React from "react";

import { NavLink } from "..";
import { TypedSecondaryMenuQuery } from "./queries";

import "./scss/index.scss";

class Nav extends React.PureComponent {
  render() {
    return (
      <footer className="footer-nav">
        <div className="container">
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
           <div className="footer-nav__section footer-right">
<h4 className="footer-nav__section-header">
Contact</h4>
                  <div className="footer-nav__section-content">
                  <p>How can we help?<br/>
                  Email: matt@shifteverything.cc<br/>
                  Call: 07939 188943</p>
                 <p>Shift Everything is a trading name of Clever Crow Cycleworks Ltd. Company number 123321331</p>
                  </div>

</div>

        </div>
      </footer>
    );
  }
}

export default Nav;
