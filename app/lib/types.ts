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

export type EventInfoProp = {
  id: string;
  title: string;
  start: string;
  end?: string;
};

export type ExtendedProps = {
  numberOPeople: string;
  comments: string;
  status: number;
};

export type EventProp = {
  id: string;
  title: string;
  start: string;
  end: string;
  extendedProps: ExtendedProps;
  description?: string;
};
