import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios"
import Seo from "../components/Seo";
import styled from "styled-components";

const Title = styled.h1`
  color: white;
`


const baseURL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=`
export default function Search() {
  const router = useRouter()
  const [searchResult, setSearchResult] = useState([])

  useEffect(() => {
    const keyword = router.query.keyword
    axios.get(`${baseURL}${keyword}`)
      .then(res => {
        const results = res.data;
        console.log(results)
        setSearchResult(results.results);
      })
      console.log(searchResult)
  }, [])

  return (
    <>
      <Seo title="search"/>
      <Title>Search</Title>
      {console.log("hello")}
      {searchResult.map((s) => {
        <div>
          {s}
        </div>
      })
    }
    </>
  );
}


