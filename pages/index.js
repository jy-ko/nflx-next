import Seo from "../components/Seo";
import { useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useRouter } from "next/router";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background: black;
  overflow-x: hidden;
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
`;
const Title = styled.h2`
  font-size: 48px;
  margin-bottom: 24px;
  color: white;
`;
const Overview = styled.p`
  color: white;
`;

const Slider = styled.div`
  position: relative;
  top: -160px;
`;
const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
  padding: 20px;
`;

const Box = styled(motion.div)`
  background-color: white;
  background-size: cover;
  background-image: url(${(props) => props.bgPhoto});
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: black;
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;
const Overlay = styled(motion.div)`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const MovieModal = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: scroll;
  overflow-x: hidden;
  background-color: black;
  padding: 1rem;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: white;
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: white;
`;

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const offset = 6;

export default function Home({ results }) {
  const router = useRouter();
  const { scrollY } = useScroll();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const increaseIndex = () => {
    if (results) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId) => {
    router.push(`?${movieId}`);
  };
  const onOverlayClick = () => {
    router.push(`/`);
  };
  const clickedMovie =
    Object.keys(router.query) && results.find((movie) => movie.id === +Object.keys(router.query));
  return (
    <Wrapper>
      <Seo title="Home" />
      <>
        <Banner
          onClick={increaseIndex}
          bgPhoto={makeImagePath(results[0].backdrop_path)}
        >
          <Title>{results[0].title}</Title>
          <Overview>{results[0].overview}</Overview>
        </Banner>
        <Slider>
          <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
            <Row>
              {results
                .slice(1)
                .slice(offset * index, offset * index + offset)
                .map((movie) => (
                  <Box
                    layoutId={movie.id + ""}
                    key={movie.id}
                    whileHover="hover"
                    initial="normal"
                    onClick={() => onBoxClicked(movie.id)}
                    variants={boxVariants}
                    bgPhoto={makeImagePath(movie.backdrop_path)}
                    transition={{ type: "tween" }}
                  >
                    <Info variants={infoVariants}>
                      <h4>{movie.title}</h4>
                    </Info>
                  </Box>
                ))}
            </Row>
          </AnimatePresence>
        </Slider>
        <AnimatePresence>
          {clickedMovie ? (
            <>
              <Overlay
                onClick={onOverlayClick}
                exit={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <MovieModal
                  layoutId={router.query}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </MovieModal>
              </Overlay>
            </>
          ) : null}
        </AnimatePresence>
      </>
    </Wrapper>
  );
}

export async function getServerSideProps() {
  const { results } = await (
    await fetch(`http://localhost:3000/api/movies`)
  ).json();
  return {
    props: {
      results,
    },
  };
}
