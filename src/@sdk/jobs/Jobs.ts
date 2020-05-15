import { ApolloClientManager } from "../data/ApolloClientManager";
import { LocalStorageHandler } from "../helpers/LocalStorageHandler";
import { CartJobs } from "./Cart";
import { CheckoutJobs } from "./Checkout";
import { UserJobs } from "./User";

export interface IJobs {
  user: UserJobs;
  cart: CartJobs;
  checkout: CheckoutJobs;
}

export class Jobs implements IJobs {
  user: UserJobs;
  cart: CartJobs;
  checkout: CheckoutJobs;

  constructor(
    localStorageHandler: LocalStorageHandler,
    apolloClientManager: ApolloClientManager
  ) {
    this.user = new UserJobs(localStorageHandler, apolloClientManager);
    this.cart = new CartJobs();
    this.checkout = new CheckoutJobs(localStorageHandler, apolloClientManager);
  }
}
