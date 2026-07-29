type User = {
  id: number;
  name: string;
};

declare namespace App {
  interface Locals {
    user: User;
    welcomeTitle: () => string;
    orders: Map<string, object>;
    session: import("./lib/server/session").Session | null;
  }
}