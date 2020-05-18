import { User } from "../fragments/gqlTypes/User";
import {
  ICheckoutModel,
  ICheckoutModelPrice,
  ICheckoutModelPriceValue,
  IPaymentModel,
} from "../helpers/LocalStorageHandler";
import { GetShopPaymentGateways_shop_availablePaymentGateways } from "../queries/gqlTypes/GetShopPaymentGateways";

export enum StateItems {
  USER,
  SIGN_IN_TOKEN,
  CHECKOUT,
  SUMMARY_PRICES,
  PROMO_CODE,
  PAYMENT,
  PAYMENT_GATEWAYS,
}

export interface ISaleorStateSummeryPrices {
  shippingPrice?: ICheckoutModelPriceValue;
  subtotalPrice?: ICheckoutModelPrice;
  totalPrice?: ICheckoutModelPrice;
  discount?: ICheckoutModelPriceValue;
}

export interface ISaleorState {
  user?: User | null;
  checkout?: ICheckoutModel;
  selectedShippingAddressId?: string;
  selectedBillingAddressId?: string;
  summaryPrices?: ISaleorStateSummeryPrices;
  payment?: IPaymentModel;
  // Should be changed it in future to shop object containing payment gateways besides all the shop data
  availablePaymentGateways?: GetShopPaymentGateways_shop_availablePaymentGateways[];
}
