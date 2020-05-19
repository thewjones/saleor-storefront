import { round } from "lodash";

import { DataErrorCheckoutTypes } from "../api/Checkout/types";
import { ApolloClientManager } from "../data/ApolloClientManager";
import { User } from "../fragments/gqlTypes/User";
import { NamedObservable } from "../helpers";
import {
  ICheckoutModel,
  IPaymentModel,
  LocalStorageEvents,
  LocalStorageHandler,
  LocalStorageItems,
} from "../helpers/LocalStorageHandler";
import { GetShopPaymentGateways_shop_availablePaymentGateways } from "../queries/gqlTypes/GetShopPaymentGateways";
import { ApolloErrorWithUserInput } from "../react/types";
import { ISaleorStateSummeryPrices, StateItems } from "./types";

export interface SaleorStateLoaded {
  user: boolean;
  signInToken: boolean;
  checkout: boolean;
  payment: boolean;
  paymentGateways: boolean;
  summaryPrices: boolean;
}

const defaultSaleorStateLoaded = {
  checkout: false,
  payment: false,
  paymentGateways: false,
  signInToken: false,
  summaryPrices: false,
  user: false,
};

export class SaleorState extends NamedObservable<StateItems> {
  user?: User | null;
  signInToken?: string | null;
  checkout?: ICheckoutModel;
  promoCode?: string;
  selectedShippingAddressId?: string;
  selectedBillingAddressId?: string;
  payment?: IPaymentModel;
  summaryPrices?: ISaleorStateSummeryPrices;
  // Should be changed it in future to shop object containing payment gateways besides all the shop data
  availablePaymentGateways?: GetShopPaymentGateways_shop_availablePaymentGateways[];

  loaded: SaleorStateLoaded;

  private localStorageHandler: LocalStorageHandler;
  private apolloClientManager: ApolloClientManager;

  constructor(
    localStorageHandler: LocalStorageHandler,
    apolloClientManager: ApolloClientManager
  ) {
    super();
    this.localStorageHandler = localStorageHandler;
    this.apolloClientManager = apolloClientManager;

    this.loaded = defaultSaleorStateLoaded;

    this.initState();
  }

  private initState = async () => {
    this.localStorageHandler.subscribeToChange(
      LocalStorageItems.CHECKOUT,
      this.onCheckoutUpdate
    );
    this.localStorageHandler.subscribeToChange(
      LocalStorageItems.PAYMENT,
      this.onPaymentUpdate
    );
    this.localStorageHandler.subscribeToChange(
      LocalStorageItems.TOKEN,
      this.onSignInTokenUpdate
    );
    this.localStorageHandler.subscribeToChange(
      LocalStorageEvents.CLEAR,
      this.onClearLocalStorage
    );

    this.provideSignInToken();
    this.apolloClientManager.watchUser(value => {
      this.onUserUpdate(value.data?.me);
    });
    await this.provideCheckout(() => null, true);
    await this.providePayment(true);
    await this.providePaymentGateways(() => null);
  };

  private provideSignInToken = () => {
    this.onSignInTokenUpdate(this.localStorageHandler.getSignInToken());
  };
  // private provideUser = async () => {
  //   const result = await this.apolloClientManager.getUser();
  //   // const res = await result.refetch();
  //   console.log("r", result);

  //   // if (error) {
  //   //   // onError(error, DataErrorCheckoutTypes.GET_CHECKOUT);
  //   // } else if (data) {
  //   // this.onUserUpdate(data.me);
  //   // }
  // };
  private provideCheckout = async (
    onError: (
      error: ApolloErrorWithUserInput | any,
      type: DataErrorCheckoutTypes
    ) => any,
    forceReload?: boolean
  ) => {
    if (this.isCheckoutCreatedOnline() && !forceReload) {
      return;
    }

    if (navigator.onLine) {
      await this.provideCheckoutOnline(onError);
    } else {
      this.provideCheckoutOffline(forceReload);
    }

    return;
  };
  private providePayment = async (forceReload?: boolean) => {
    this.providePaymentOffline(forceReload);

    return;
  };
  private providePaymentGateways = async (
    onError: (
      error: ApolloErrorWithUserInput | any,
      type: DataErrorCheckoutTypes
    ) => any
  ) => {
    await this.providePaymentGatewaysOnline(onError);
  };

  private onLoadedUpdate = (newLoaded: Partial<SaleorStateLoaded>) => {
    this.loaded = {
      ...this.loaded,
      ...newLoaded,
    };
    this.notifyChange(StateItems.LOADED, this.loaded);
  };
  private onClearLocalStorage = () => {
    this.onSignInTokenUpdate(null);
    this.onUserUpdate(null);
    this.onCheckoutUpdate();
    this.onPaymentUpdate();
  };

  private onSignInTokenUpdate = (token: string | null) => {
    this.signInToken = token;
    this.notifyChange(StateItems.SIGN_IN_TOKEN, this.signInToken);
    this.onLoadedUpdate({
      signInToken: true,
    });
  };
  private onUserUpdate = (user: User | null) => {
    this.user = user;
    this.notifyChange(StateItems.USER, this.user);
    this.onLoadedUpdate({
      user: true,
    });
  };
  private onCheckoutUpdate = (checkout?: ICheckoutModel) => {
    this.checkout = checkout;
    this.summaryPrices = this.calculateSummaryPrices(checkout);
    this.notifyChange(StateItems.CHECKOUT, this.checkout);
    this.notifyChange(StateItems.SUMMARY_PRICES, this.summaryPrices);
    this.onLoadedUpdate({
      checkout: true,
      summaryPrices: true,
    });
  };
  private onPaymentUpdate = (payment?: IPaymentModel) => {
    this.payment = payment;
    this.notifyChange(StateItems.PAYMENT, this.payment);
    this.onLoadedUpdate({
      payment: true,
    });
  };
  private onPaymentGatewaysUpdate = (
    paymentGateways?: GetShopPaymentGateways_shop_availablePaymentGateways[]
  ) => {
    this.availablePaymentGateways = paymentGateways;
    this.notifyChange(
      StateItems.PAYMENT_GATEWAYS,
      this.availablePaymentGateways
    );
    this.onLoadedUpdate({
      paymentGateways: true,
    });
  };

  private isCheckoutCreatedOnline = () => this.checkout?.id;

  private provideCheckoutOnline = async (
    onError: (
      error: ApolloErrorWithUserInput | any,
      type: DataErrorCheckoutTypes
    ) => any
  ) => {
    // 1. Try to take checkout from backend database
    const checkout = this.localStorageHandler.getCheckout();

    // if (checkout?.token) {
    const { data, error } = await this.apolloClientManager.getCheckout(
      !!this.user,
      checkout?.token
    );

    console.log("er", data, error);

    if (error) {
      onError(error, DataErrorCheckoutTypes.GET_CHECKOUT);
    } else if (data) {
      this.localStorageHandler.setCheckout(data);
      return;
    }
    // }

    // 2. Try to take checkout from local storage
    const checkoutModel: ICheckoutModel | null = this.localStorageHandler.getCheckout();
    if (checkoutModel) {
      this.onCheckoutUpdate(checkoutModel);
      return;
    }
  };

  private provideCheckoutOffline = (forceReload?: boolean) => {
    // 1. Try to take checkout from runtime memory (if exist in memory - has any checkout data)
    if (this.checkout && !forceReload) {
      return;
    }

    // 2. Try to take checkout from local storage
    const checkoutModel: ICheckoutModel | null = this.localStorageHandler.getCheckout();

    if (checkoutModel) {
      this.onCheckoutUpdate(checkoutModel);
    } else {
      this.localStorageHandler.setCheckout({});
    }
  };

  private providePaymentOffline = (forceReload?: boolean) => {
    // 1. Try to take checkout from runtime memory (if exist in memory - has any checkout data)
    if (this.payment && !forceReload) {
      return;
    }

    // 2. Try to take checkout from local storage
    const paymentModel: ICheckoutModel | null = this.localStorageHandler.getPayment();

    if (paymentModel) {
      this.onPaymentUpdate(paymentModel);
    } else {
      this.localStorageHandler.setPayment({});
    }
  };

  private providePaymentGatewaysOnline = async (
    onError: (
      error: ApolloErrorWithUserInput | any,
      type: DataErrorCheckoutTypes
    ) => any
  ) => {
    const { data, error } = await this.apolloClientManager.getPaymentGateways();

    if (error) {
      onError(error, DataErrorCheckoutTypes.GET_PAYMENT_GATEWAYS);
    }

    this.onPaymentGatewaysUpdate(data);
  };

  private calculateSummaryPrices(
    checkout?: ICheckoutModel
  ): ISaleorStateSummeryPrices {
    const items = checkout?.lines;
    const shippingMethod = checkout?.shippingMethod;
    const promoCodeDiscount = checkout?.promoCodeDiscount?.discount;

    if (items && items.length) {
      const firstItemTotalPrice = items[0].totalPrice;

      if (firstItemTotalPrice) {
        const shippingPrice = {
          ...shippingMethod?.price,
          amount: shippingMethod?.price?.amount || 0,
          currency:
            shippingMethod?.price?.currency ||
            firstItemTotalPrice.gross.currency,
        };

        const { itemsNetPrice, itmesGrossPrice } = items.reduce(
          (prevVals, item) => {
            prevVals.itemsNetPrice += item.totalPrice?.net.amount || 0;
            prevVals.itmesGrossPrice += item.totalPrice?.gross.amount || 0;
            return prevVals;
          },
          {
            itemsNetPrice: 0,
            itmesGrossPrice: 0,
          }
        );

        const subtotalPrice = {
          ...firstItemTotalPrice,
          gross: {
            ...firstItemTotalPrice.gross,
            amount: round(itmesGrossPrice, 2),
          },
          net: {
            ...firstItemTotalPrice.net,
            amount: round(itemsNetPrice, 2),
          },
        };

        const discount = {
          ...promoCodeDiscount,
          amount: promoCodeDiscount?.amount || 0,
          currency:
            promoCodeDiscount?.currency || firstItemTotalPrice.gross.currency,
        };

        const totalPrice = {
          ...subtotalPrice,
          gross: {
            ...subtotalPrice.gross,
            amount: round(
              itmesGrossPrice + shippingPrice.amount - discount.amount,
              2
            ),
          },
          net: {
            ...subtotalPrice.net,
            amount: round(
              itemsNetPrice + shippingPrice.amount - discount.amount,
              2
            ),
          },
        };

        return {
          discount,
          shippingPrice,
          subtotalPrice,
          totalPrice,
        };
      }
    }
    return {};
  }
}
