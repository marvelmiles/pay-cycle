const dashboard = () => "/dashboard";

const transactions = () => `${dashboard()}/transactions`;

const transactionDetails = (id = ":id") => `${transactions()}/${id}`;

const routes = {
  transactions,
  transactionDetails,
};

export default routes;
