import { ApolloError, ObservableQuery, ApolloQueryResult } from "apollo-client";

import {
  ICheckoutAddress,
  ICheckoutModel,
  ICheckoutModelLine,
  IOrderModel,
  IPaymentModel,
} from "@sdk/helpers/LocalStorageHandler";
import { UserDetails } from "@sdk/queries/types/UserDetails";

export enum PendingSaveItems {
  UPDATE_CART = "updateCart",
  BILLING_ADDRESS = "billingAddress",
  SHIPPING_ADDRESS = "shippingAddress",
  SHIPPING_AS_BILLING_ADDRESS = "shippingAsBillingAddress",
}

export interface ApolloErrorWithUserInput extends ApolloError {
  extraInfo: {
    userInputErrors?: any[];
  };
}

export interface IApolloClientManagerResponse<T> {
  data?: T;
  error?: ApolloErrorWithUserInput;
}

export interface IApolloClientManager {
  watchUser: (
    next: (value: ApolloQueryResult<UserDetails>) => void,
    error?: (error: any) => void,
    complete?: () => void
  ) => void;
  getCheckout: (
    checkoutToken: string | null
  ) => Promise<IApolloClientManagerResponse<ICheckoutModel>>;
  getRefreshedCheckoutLines: (
    checkoutlines: ICheckoutModelLine[] | null
  ) => Promise<IApolloClientManagerResponse<ICheckoutModelLine[]>>;
  createCheckout: (
    email: string,
    lines: Array<{ variantId: string; quantity: number }>,
    shippingAddress: ICheckoutAddress,
    billingAddress?: ICheckoutAddress
  ) => Promise<IApolloClientManagerResponse<ICheckoutModel>>;
  setCartItem: (
    checkout: ICheckoutModel
  ) => Promise<IApolloClientManagerResponse<ICheckoutModel>>;
  setBillingAddress: (
    billingAddress: ICheckoutAddress,
    checkoutId: string
  ) => Promise<IApolloClientManagerResponse<ICheckoutModel>>;
  setBillingAddressWithEmail: (
    billingAddress: ICheckoutAddress,
    email: string,
    checkoutId: string
  ) => Promise<IApolloClientManagerResponse<ICheckoutModel>>;
  setShippingAddress: (
    shippingAddress: ICheckoutAddress,
    email: string,
    checkoutId: string
  ) => Promise<IApolloClientManagerResponse<ICheckoutModel>>;
  setShippingMethod: (
    shippingMethodId: string,
    checkoutId: string
  ) => Promise<IApolloClientManagerResponse<ICheckoutModel>>;
  addPromoCode: (
    promoCode: string,
    checkoutId: string
  ) => Promise<IApolloClientManagerResponse<ICheckoutModel>>;
  removePromoCode: (
    promoCode: string,
    checkoutId: string
  ) => Promise<IApolloClientManagerResponse<ICheckoutModel>>;
  createPayment: (
    amount: number,
    checkoutId: string,
    paymentGateway: string,
    paymentToken: string,
    billingAddress: ICheckoutAddress
  ) => Promise<IApolloClientManagerResponse<IPaymentModel>>;
  completeCheckout: (
    checkoutId: string
  ) => Promise<IApolloClientManagerResponse<IOrderModel>>;
}
