import "./scss/index.scss";

import classNames from "classnames";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { generateCategoryUrl } from "../../core/utils";

import {
  ProductsList_categories,
  ProductsList_shop,
  ProductsList_shop_homepageCollection_backgroundImage,
} from "./gqlTypes/ProductsList";

import { structuredData } from "../../core/SEO/Homepage/structuredData";

import noPhotoImg from "../../images/no-photo.svg";

const { useEffect } = React;


const Page: React.FC<{
  loading: boolean;
  categories: ProductsList_categories;
  backgroundImage: ProductsList_shop_homepageCollection_backgroundImage;
  shop: ProductsList_shop;
}> = ({ loading, categories, backgroundImage, shop }) => {
  const categoriesExist = () => {
    return categories && categories.edges && categories.edges.length > 0;
  };
  const intl = useIntl();

useEffect(() => {
    // Add a class to the body.
    document.body.classList.add('home');

    return () => {
      // Remove the class from the body.
      document.body.classList.remove('home');
    };
  }, ['fixed']);


  return (
    <>
      <script className="structured-data-list" type="application/ld+json">
        {structuredData(shop)}
      </script>
      <div
        className="home-page__hero"
        style={{backgroundImage: `url(${require("../../images/milk-plus-sides-cover.png")})`}}
      >

      </div>
      <div className="container">
        <div className="home-page__featured">
          <h2>One Bicycle. Many Options.</h2>
          <ul className="home-page__collections">
            <li><a href="/product/bullitt-base/52/" className="basis"><article><h3>Base build</h3></article></a></li>
            <li><a href="/collection/family/3" className="kids"><article><h3>Family</h3></article></a></li>
            <li><a href="/collection/general-cargo/4/" className="dogs"><article><h3>Dog transit</h3></article></a></li>
            <li><a href="/product/ebullitt-business/62/" className="electric"><article><h3>Electric</h3></article></a></li>
            <li><a href="/collection/business/5/" className="business"><article><h3>Business</h3></article></a></li>
            <li><a href="/collection/general-cargo/4/" className="touring"><article><h3>Touring</h3></article></a></li>
          </ul>
        </div>
      </div>

      <div className="home-page__featured home-page__featured--banner">

        <div className="container">
          <h2>Why Bullitt Cargo Bikes?</h2>

          <ul className="home-page__benefits">
            <li>
              <h3>Adaptable</h3>
              <p>Flexible cargo carrying options that adapt with you. Carry kids, pets, shopping, equipment, every thing.</p>
            </li>
            <li>
              <h3>Quality components</h3>
              <p>Its hardened aluminium frame, hydraulic disc brakes and premium components make it one of the toughest cargo bikes on the market.</p>
            </li>
            <li><h3>Danish design</h3>
              <p>Designed in Copenhagen, we think it's the most thoughtfully designed, best looking cargo bike available.</p></li>
            <li><h3>One size fits</h3>
            <p>One-size, gender neutral frame geometry that can be ridden by anyone small or tall.</p></li>
            <li><h3>Ten colour finishes</h3>
            <p>It comes in colours everywhere. Go classic black or split the infinitive and boldly go with one of our radical colour options.</p></li>
            <li><h3>Compact and stable</h3>
              <p>Compact frameset to negotiate UK's varying roads and cycleways.</p>
            </li>
            <li><h3>Cost effective</h3>
              <p>With minimal running costs, no fuel or parking cargo bikes are significantly cheaper per kilometre than a motor vehicle.</p>
            </li>
            <li><h3>Green machines</h3>
              <p>Drastically lower your environmental impact when you travel. Say hello to the world around you.</p>
            </li>
            <li><h3>Built to your budget</h3>
              <p>Build options to suit your budget. Ask us about a minimal single-speed cargo setup or a fully equiped family rig.</p>
            </li>
          </ul>

        </div>
      </div>





      {categoriesExist() && (
        <div className="home-page__categories home-page__featured">
          <div className="container">
            <h2>Buy online</h2>
            <div className="home-page__categories__list">
              {categories.edges.slice(0, 2).map(({ node: category }) => (
                <div key={category.id}>
                  <Link
                    to={generateCategoryUrl(category.id, category.name)}
                    key={category.id}
                  >
                    <div
                      className={classNames(
                        "home-page__categories__list__image",
                        {
                          "home-page__categories__list__image--no-photo": !category.backgroundImage,
                        }
                      )}
                      style={{
                        backgroundImage: `url(${
                          category.backgroundImage
                            ? category.backgroundImage.url
                            : noPhotoImg
                        })`,
                      }}
                    />
                    <h3>{category.name}</h3>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
