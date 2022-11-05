import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Seo from "../components/Seo";

// const { query } = useRouter();

// export async function getServerSideProps() {
//   const { results } = await (
//     await fetch(`http://localhost:3000/api/search/?keyword=${query.keyword}`)
//   ).json();
//   return {
//     props: {
//       results,
//     },
//   };
// }

export default function Search() {

  return (
    <>
      <Seo title="search"/>
      <h1>SEarch</h1>
      {/* {results.map (movie => movie.title)} */}
    </>
  );
}


