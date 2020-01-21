import React from 'react';
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const EXCHANGE_RATES = gql`
  query {
    events {
			title
			owner {
				name
			}
    }
  }
`;

const AllUsers = () => {

	const { loading, error, data } = useQuery(EXCHANGE_RATES);

  if (loading) return <p>Loading...</p>;
  if (error) {
		return <p>Error :(</p>;
	}

  return data.events.map(({ title, owner: { name } }) => (
    <div key={title+Math.random()}>
      <p>
        {title} by {name}
      </p>
    </div>
	));
};

export default AllUsers
