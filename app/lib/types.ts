export type RedisUserProp = {
  id: any;
  name: string;
  email: string;
  password: string;
  bills: Array<[]>;
};

export type AuthUserProp = {
  id: any;
  name: string;
  email: string;
};

export type MainBillProps = {
  id: string | null;
  title: string;
  billTotal: number;
  dated: Date;
  billAmountPaid: number;
  items: ItemsProps[];
  taxes: TaxesProp[];
  users: UsersProp[];
  userToItems: UserToItemsProp[];
  extraFee: ExtraFeeProp[];
};

export type UsersProp = {
  id: number;
  name: string;
};

export type ItemsProps = {
  id: number;
  name: string;
  rate: number;
  quantity: number;
};

export type UserToItemsProp = {
  userId: number;
  items: UserToItemsQuantityProp[];
};

export type UserToItemsQuantityProp = {
  itemId: number;
  quantity: number;
};

export type TaxesProp = {
  id: number;
  taxType: string;
  taxPercentage: number;
};

export type ExtraFeeProp = {
  // id: number;
  // feeType: string;
  feeAmount: number;
};
