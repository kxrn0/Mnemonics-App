import { useState, useEffect, useContext } from "react";
import Loading from "../Loading/Loading";
import ThemeContext from "../../theme_context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import "./red.css";

export default function Red() {
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState({ link: "hi" });
  const [errorState, setErrorState] = useState(false);
  const subs = ["todayilearned", "showerthoughts", "lifeprotips"];
  const intervals = ["month", "year", "all"];
  const theme = useContext(ThemeContext);

  async function load_content() {
    const sub = subs[~~(Math.random() * subs.length)];
    const interval = intervals[~~(Math.random() * intervals.length)];

    setErrorState(false);
    setIsLoading(true);

    try {
      const req = await fetch(
        `https://www.reddit.com/r/${sub}/top.json?t=${interval}&limit=100`
      );
      const res = await req.json();
      const child =
        res.data.children[~~(Math.random() * res.data.children.length)];

      setContent({
        title: child.data.title,
        link: {
          address: child.data.url,
          credit:
            sub === "todayilearned"
              ? "read more"
              : `by u/${child.data.author} on reddit`,
        },
      });
      setIsLoading(false);
    } catch (wrror) {
      console.log(wrror);
      setErrorState(true);
    }
  }

  useEffect(() => {
    load_content();
  }, []);

  return (
    <div className={`red ${theme}`}>
      {isLoading ? (
        <div className="loading-screen">
          <Loading />
          {errorState ? (
            <p>
              <button onClick={() => setErrorState(false)}>
                <FontAwesomeIcon icon={faClose} />
              </button>{" "}
              couldn't find the internet!{" "}
              <button onClick={load_content}>
                <FontAwesomeIcon icon={faArrowsRotate} />
              </button>
            </p>
          ) : null}
        </div>
      ) : (
        <div className="red-content">
          <div className="text">
            <p>{content.title}</p>
            <a className="creadits" href={content.link.address} target="_blank">
              {content.link.credit}
            </a>
          </div>
          <button className="get-another" onClick={load_content}>
            <FontAwesomeIcon icon={faArrowsRotate} />
          </button>
        </div>
      )}
    </div>
  );
}
