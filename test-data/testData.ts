export interface User {
  username: string;
  password: string;
}

export interface Product {
  name: string;
  price: string;
}

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export interface ErrorMessages {
  lockedUser: string;
  missingUsername: string;
  missingPassword: string;
  invalidCredentials: string;
}

export class TestData {
  static users: Record<string, User> = {
    standard: {
      username: 'standard_user',
      password: 'secret_sauce'
    },
    locked: {
      username: 'locked_out_user',
      password: 'secret_sauce'
    },
    problem: {
      username: 'problem_user',
      password: 'secret_sauce'
    },
    performance: {
      username: 'performance_glitch_user',
      password: 'secret_sauce'
    }
  };

  static products: Record<string, Product> = {
    backpack: {
      name: 'Sauce Labs Backpack',
      price: '$29.99'
    },
    bikeLight: {
      name: 'Sauce Labs Bike Light',
      price: '$9.99'
    },
    boltTShirt: {
      name: 'Sauce Labs Bolt T-Shirt',
      price: '$15.99'
    },
    fleeceJacket: {
      name: 'Sauce Labs Fleece Jacket',
      price: '$49.99'
    },
    onesie: {
      name: 'Sauce Labs Onesie',
      price: '$7.99'
    },
    redTShirt: {
      name: 'Test.allTheThings() T-Shirt (Red)',
      price: '$15.99'
    }
  };

  static checkoutInfo: CheckoutInfo = {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '12345'
  };

  static errorMessages: ErrorMessages = {
    lockedUser: 'Epic sadface: Sorry, this user has been locked out.',
    missingUsername: 'Epic sadface: Username is required',
    missingPassword: 'Epic sadface: Password is required',
    invalidCredentials: 'Epic sadface: Username and password do not match any user in this service'
  };
} 