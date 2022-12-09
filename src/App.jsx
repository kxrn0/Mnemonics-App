import { useState, useEffect, useRef } from "react";
import ThemeContext from "./theme_context";
import ThemeToggle from "./components/ThemeToggle/ThemeToggle";
import memData from "./data";
import Homepage from "./components/Homepage/Homepage";
import Dojo from "./components/Dojo/Dojo";
import DayPage from "./components/DayPage/DayPage";
import Category from "./components/Category/Category";
import ReviewPreview from "./components/ReviewPreview/ReviewPreview";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faDumbbell,
  faGear,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import logo from "./assets/app_logo.svg";
import Train from "./components/Train/Train";
import Test from "./components/Test/Test";
import ScrollWrapper from "./components/ScrollWrapper/ScrollWrapper";
import Preferences from "./components/Preferences/Preferences";
import { update_set, create_set } from "./data";
import new_normal from "./utilities/new_normal";
import "./style.css";
import "./anime.css";

import firebaseConfig from "./firebase.config";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  getDoc,
  deleteDoc,
  setDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { nanoid } from "nanoid";
import load_reviews from "./utilities/load_reviews";

function App() {
  const [theme, setTheme] = useState("light");
  const [data, setData] = useState([]);
  const [rottenDays, setRottenDays] = useState([]);
  const [cats, setCats] = useState(() => [
    {
      type: "words",
      elements: 5,
      secsPerEl: 3,
      animation: "drop",
      fontSize: 16,
    },
    {
      type: "images",
      elements: 10,
      secsPerEl: 3,
      animation: "drop",
      // types: ["ten_print", "circle_packing", "shapes", "water_color"],
      types: ["circle_packing"],
      width: 300,
    },
    {
      type: "numbers-decimal",
      elements: 5,
      secsPerEl: 1,
      animation: "scale",
      digits: 1,
      fontSize: 32,
    },
    {
      type: "numbers-binary",
      elements: 3,
      secsPerEl: 1,
      animation: "fade",
      digits: 3,
      fontSize: 48,
    },
  ]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");

  async function sign_in() {
    try {
      const provider = new GoogleAuthProvider();

      await signInWithPopup(getAuth(), provider);
    } catch (error) {
      console.log(error);
    }
  }

  async function sign_out() {
    await signOut(getAuth());
  }

  function set_rotten_days(days) {
    setRottenDays(days);
  }

  function process(sets, date) {
    const components = [];

    for (let set of sets) {
      for (let review of set.reviews) {
        if (review.date === date)
          components.push({
            body: {
              type: set.type,
              percentage: (
                (100 * (set.items.length - review.errors.length)) /
                set.items.length
              ).toFixed(0),
            },
            key: nanoid(),
          });
      }
    }
    return components;
  }

  async function change_theme(event) {
    const theme = event.target.dataset.theme;

    const userRef = doc(getFirestore(), `users/${userId}`);

    await updateDoc(userRef, { theme });
    setTheme(theme);
  }

  async function change_settings(type, newCat) {
    const newCats = cats.map((cat) => (cat.type !== type ? cat : newCat));
    const userRef = doc(getFirestore(), `users/${userId}`);

    await updateDoc(userRef, { categories: newCats });
    setCats(newCats);
  }

  async function update(review, id) {
    const setRef = doc(getFirestore(), `users/${userId}/sets/${id}`);
    const reviews = data.find((set) => set.id === id).reviews;

    await updateDoc(setRef, { reviews: [...reviews, review] });
    setData((prevData) =>
      prevData.map((set) =>
        set.id === id ? { ...set, reviews: [...set.reviews, review] } : set
      )
    );

    // setData((prevData) =>
    //   prevData.map((item) => {
    //     if (item.id !== id) return item;
    //     else {
    //       const newAvg =
    //         item.avgScore +
    //         ((item.items.length - review.errors.length) / item.items.length -
    //           item.avgScore) /
    //           (item.items.length + 1);
    //       return {
    //         ...item,
    //         avgScore: newAvg,
    //         reviews: [...item.reviews, review],
    //       };
    //     }
    //   })
    // );
  }

  async function create(set) {
    await setDoc(doc(getFirestore(), `users/${userId}/sets/${set.id}`), {
      ...set,
      timestamp: serverTimestamp(),
    });
    setData((prevSets) => [...prevSets, set]);
  }

  async function load_data() {
    const userId = getAuth().currentUser.uid;
    const setsQuery = query(
      collection(getFirestore(), `users/${userId}/sets`),
      orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(setsQuery);
    const sets = [];

    // querySnapshot.forEach((doc) => console.log(doc.data()));
    // const byme = querySnapshot.map((doc) => doc.data());
    // console.log(byme);

    // querySnapshot.forEach((doc) => console.log(doc.data()));
    // const unsub = onSnapshot(setsQuery, (snapshot) =>
    //   snapshot.docChanges().forEach(async (change) => {
    //     if (change.type === "removed")
    //       setData((prevSets) =>
    //         prevSets.filter((set) => set.id !== change.doc.id)
    //       );
    //     else {
    //       const set = change.doc.data();
    //       const reviews = await load_reviews(set.id);

    //       console.log(reviews);

    //       setData((prevSets) => {
    //         const current = prevSets.find((other) => other.id === set.id);

    //         if (!current) return [...prevSets, current];
    //         else
    //           return prevSets.map((other) =>
    //             other.id === set.id ? { ...set, reviews } : other
    //           );
    //       });
    //     }
    //   })
    // );
    const userRef = doc(getFirestore(), `users/${userId}`);
    const userSnap = await getDoc(userRef);

    if (!userSnap.data())
      await setDoc(doc(getFirestore(), `users/${userId}`), {
        theme,
        categories: cats,
      });
    else {
      setTheme(userSnap.data().theme);
      setCats(userSnap.data().categories);
    }

    querySnapshot.forEach((doc) => sets.push(doc.data()));
    querySnapshot.forEach((doc) => console.log(doc));
    setData(sets);

    // return unsub;
  }

  useState(() => initializeApp(firebaseConfig), []);

  useEffect(() => {
    let unsub;

    onAuthStateChanged(getAuth(), async () => {
      setIsLoggedIn(() => !!getAuth().currentUser);
      if (getAuth().currentUser) {
        unsub = await load_data();
        setUserId(getAuth().currentUser.uid);
      }
    });

    // return () => (unsub ? unsub() : null);
  }, []);

  return (
    <div className={`App ${theme}`}>
      <button onClick={() => console.log(data)}>shalom</button>
      {isLoggedIn ? (
        <BrowserRouter>
          <ScrollWrapper>
            <ThemeContext.Provider value={theme}>
              <nav className="navbar">
                <div className="logo">
                  <img src={logo} alt="" />
                  <p className="user">byme</p>
                </div>
                <div className="links">
                  <Link to="/">
                    <FontAwesomeIcon icon={faHome} />
                  </Link>
                  <Link to="/train">
                    <FontAwesomeIcon icon={faDumbbell} />
                  </Link>
                  <Link to="/settings">
                    <FontAwesomeIcon icon={faGear} />
                  </Link>
                  <Link to="/info">
                    <FontAwesomeIcon icon={faCircleInfo} />
                  </Link>
                </div>
              </nav>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Homepage
                      key={data.length}
                      set={data}
                      process={process}
                      set_rotten_days={set_rotten_days}
                    />
                  }
                />
                <Route path="/train" element={<Dojo />} />
                <Route
                  path="/settings"
                  element={
                    <Preferences
                      change_theme={change_theme}
                      themes={["light", "dark", "neom"]}
                    />
                  }
                />
                {rottenDays.map((day) => (
                  <Route
                    key={day}
                    path={`/days/${day}`}
                    element={<DayPage sets={data} date={day} />}
                  />
                ))}
                {cats.map((cat) => (
                  <Route
                    key={cat.type}
                    path={`/train/${cat.type}`}
                    element={
                      <Category
                        key={data.length}
                        category={cat}
                        sets={data}
                        process={process}
                        PreviewComponent={ReviewPreview}
                        set_rotten_days={set_rotten_days}
                        save_settings={change_settings}
                      />
                    }
                  />
                ))}
                {cats.map((cat) => (
                  <Route
                    key={cat.type}
                    path={`/train/${cat.type}/grounds`}
                    element={<Train category={cat} />}
                  />
                ))}
                <Route
                  path="/test/"
                  element={<Test update_set={update} create_set={create} />}
                />
              </Routes>
              <div
                style={{
                  position: "fixed",
                  top: "10rem",
                  right: "2rem",
                }}
              >
                <ThemeToggle
                  themes={["light", "dark", "neom"]}
                  currentTheme={theme}
                  change_theme={change_theme}
                />
              </div>
            </ThemeContext.Provider>
          </ScrollWrapper>
        </BrowserRouter>
      ) : (
        <button onClick={sign_in}>log in</button>
      )}
    </div>
  );
}

export default App;
