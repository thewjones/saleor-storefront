import { LocalStorageManager } from "@sdk/data";
import { ErrorListener } from "@sdk/helpers";
import { ICheckoutModel } from "@sdk/helpers/LocalStorageHandler";
import { JobsManager } from "@sdk/jobs";
import { ErrorCartTypes } from "@sdk/jobs/Cart";
import { SaleorState, SaleorStateLoaded } from "@sdk/state";
import { ISaleorStateSummeryPrices, StateItems } from "@sdk/state/types";
import { ApolloClientManager } from "@temp/@sdk/data/ApolloClientManager";

import {
  IDiscount,
  IItems,
  IShippingPrice,
  ISubtotalPrice,
  ITotalPrice,
} from "./types";

export class SaleorCartAPI extends ErrorListener {
  loaded: boolean;
  items: IItems;
  totalPrice: ITotalPrice;
  subtotalPrice: ISubtotalPrice;
  shippingPrice: IShippingPrice;
  discount?: IDiscount;

  private localStorageManager: LocalStorageManager;
  private saleorState: SaleorState;
  private apolloClientManager: ApolloClientManager;
  private jobsManager: JobsManager;

  constructor(
    localStorageManager: LocalStorageManager,
    apolloClientManager: ApolloClientManager,
    saleorState: SaleorState,
    loadOnStart: boolean,
    jobsManager: JobsManager
  ) {
    super();
    this.saleorState = saleorState;
    this.localStorageManager = localStorageManager;
    this.apolloClientManager = apolloClientManager;
    this.jobsManager = jobsManager;

    this.loaded = false;

    this.jobsManager.attachErrorListener("cart", this.fireError);

    this.saleorState.subscribeToChange(
      StateItems.CHECKOUT,
      (checkout: ICheckoutModel) => {
        this.items = checkout?.lines
          ?.filter(line => line.quantity > 0)
          .sort((a, b) => {
            if (a.id && b.id) {
              const aId = a.id?.toUpperCase() || "";
              const bId = b.id?.toUpperCase() || "";
              return aId < bId ? -1 : aId > bId ? 1 : 0;
            } else {
              const aId = a.variant.id?.toUpperCase() || "";
              const bId = b.variant.id?.toUpperCase() || "";
              return aId < bId ? -1 : aId > bId ? 1 : 0;
            }
          });
      }
    );
    this.saleorState.subscribeToChange(
      StateItems.SUMMARY_PRICES,
      (summaryPrices: ISaleorStateSummeryPrices) => {
        const { totalPrice, subtotalPrice, shippingPrice, discount } =
          summaryPrices || {};
        this.totalPrice = totalPrice;
        this.subtotalPrice = subtotalPrice;
        this.shippingPrice = shippingPrice;
        this.discount = discount;
      }
    );
    this.saleorState.subscribeToChange(
      StateItems.LOADED,
      (loaded: SaleorStateLoaded) => {
        this.loaded = loaded.checkout && loaded.summaryPrices;
      }
    );

    // if (loadOnStart) {
    //   this.load();
    // }
  }

  // load = async () => {
  //   await this.saleorState.provideCheckout(this.fireError, true);
  //   return {
  //     pending: false,
  //   };
  // };

  addItem = async (variantId: string, quantity: number) => {
    // await this.saleorState.provideCheckout(this.fireError);

    // 1. save in local storage
    this.localStorageManager.addItemToCart(variantId, quantity);

    // 2. save online if possible (if checkout id available)
    if (this.saleorState.checkout?.lines) {
      const {
        data,
        error,
      } = await this.apolloClientManager.getRefreshedCheckoutLines(
        this.saleorState.checkout.lines
      );

      if (error) {
        this.fireError(error, ErrorCartTypes.SET_CART_ITEM);
      } else {
        this.localStorageManager.getHandler().setCheckout({
          ...this.saleorState.checkout,
          lines: data,
        });
      }
    }
    if (this.saleorState.checkout?.id) {
      this.jobsManager.addToQueue("cart", "setCartItem");
      return {
        pending: true,
      };
    }
    return {
      pending: false,
    };
  };

  removeItem = async (variantId: string) => {
    // await this.saleorState.provideCheckout(this.fireError);

    // 1. save in local storage
    this.localStorageManager.removeItemFromCart(variantId);
    // 2. save online if possible (if checkout id available)
    if (this.saleorState.checkout?.lines) {
      const {
        data,
        error,
      } = await this.apolloClientManager.getRefreshedCheckoutLines(
        this.saleorState.checkout.lines
      );

      if (error) {
        this.fireError(error, ErrorCartTypes.SET_CART_ITEM);
      } else {
        this.localStorageManager.getHandler().setCheckout({
          ...this.saleorState.checkout,
          lines: data,
        });
      }
    }
    if (this.saleorState.checkout?.id) {
      this.jobsManager.addToQueue("cart", "setCartItem");
      return {
        pending: true,
      };
    }
    return {
      pending: false,
    };
  };

  subtractItem = async (variantId: string) => {
    // await this.saleorState.provideCheckout(this.fireError);

    // 1. save in local storage
    this.localStorageManager.subtractItemFromCart(variantId);

    // 2. save online if possible (if checkout id available)
    if (this.saleorState.checkout?.lines) {
      const {
        data,
        error,
      } = await this.apolloClientManager.getRefreshedCheckoutLines(
        this.saleorState.checkout.lines
      );

      if (error) {
        this.fireError(error, ErrorCartTypes.SET_CART_ITEM);
      } else {
        this.localStorageManager.getHandler().setCheckout({
          ...this.saleorState.checkout,
          lines: data,
        });
      }
    }
    if (this.saleorState.checkout?.id) {
      this.jobsManager.addToQueue("cart", "setCartItem");
      return {
        pending: true,
      };
    }
    return {
      pending: false,
    };
  };

  updateItem = async (variantId: string, quantity: number) => {
    // await this.saleorState.provideCheckout(this.fireError);

    // 1. save in local storage
    this.localStorageManager.updateItemInCart(variantId, quantity);

    // 2. save online if possible (if checkout id available)
    if (this.saleorState.checkout?.lines) {
      const {
        data,
        error,
      } = await this.apolloClientManager.getRefreshedCheckoutLines(
        this.saleorState.checkout.lines
      );

      if (error) {
        this.fireError(error, ErrorCartTypes.SET_CART_ITEM);
      } else {
        this.localStorageManager.getHandler().setCheckout({
          ...this.saleorState.checkout,
          lines: data,
        });
      }
    }
    if (this.saleorState.checkout?.id) {
      this.jobsManager.addToQueue("cart", "setCartItem");
      return {
        pending: true,
      };
    }
    return {
      pending: false,
    };
  };
}
