import { useState, useEffect, useRef } from "react";
import ThemeContext from "./theme_context";
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
import Loading from "./components/Loading/Loading";
import SlideScreen from "./components/SlideScreen/SlideScreen";
import Preferences from "./components/Preferences/Preferences";
import new_normal from "./utilities/new_normal";
import placeholder from "./assets/ac.png";
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
  query,
  orderBy,
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
import "./style.css";
import "./anime.css";
import About from "./components/About/About";

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
      types: ["ten_print", "circle_packing", "shapes"],
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
  const [iseDeleting, setIsDeleting] = useState(false);
  const [photo, setPhoto] = useState(placeholder);

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
    setUserId("");
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

  async function rename_set(id, value) {
    const setRef = doc(getFirestore(), `users/${userId}/sets/${id}`);

    await updateDoc(setRef, { name: value });
    setData((prevSets) =>
      prevSets.map((set) => (set.id === id ? { ...set, name: value } : set))
    );
  }

  async function delete_set(id) {
    const set = data.find((set) => set.id === id);

    setIsDeleting(true);

    if (set.type === "images") {
      for (let image of set.items)
        await deleteObject(ref(getStorage(), image.uri));
    }
    await deleteDoc(doc(getFirestore(), `users/${userId}/sets/${id}`));
    setData((prevSets) => prevSets.filter((set) => set.id !== id));

    setIsDeleting(false);
  }

  async function update(review, id) {
    console.log("review: ");
    console.log(review);

    const setRef = doc(getFirestore(), `users/${userId}/sets/${id}`);
    const saidSet = data.find((set) => set.id === id);
    const reviews = saidSet.reviews;
    const newAvg = new_normal(
      saidSet.avgScore,
      (saidSet.items.length - review.errors.length) / saidSet.items.length,
      saidSet.reviews.length
    );

    await updateDoc(setRef, {
      reviews: [...reviews, review],
      avgScore: newAvg,
    });
    setData((prevData) =>
      prevData.map((set) =>
        set.id === id
          ? { ...set, reviews: [...set.reviews, review], avgScore: newAvg }
          : set
      )
    );
  }

  async function upload_files(elements, id) {
    const map = new Map();

    for (let element of elements) {
      const filePath = `users/${userId}/sets/${id}/${element.file.name}`;
      const imgRef = ref(getStorage(), filePath);
      let imageURL;
      const fileSnapshot = await uploadBytesResumable(imgRef, element.file);
      imageURL = await getDownloadURL(imgRef);

      map.set(element.src, {
        imageURL,
        storageURI: fileSnapshot.metadata.fullPath,
      });
    }
    return map;
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

    setPhoto(getAuth().currentUser.photoURL);

    querySnapshot.forEach((doc) => sets.push(doc.data()));
    setData(sets);
  }

  useState(() => initializeApp(firebaseConfig), []);

  useEffect(() => {
    onAuthStateChanged(getAuth(), async () => {
      setIsLoggedIn(() => !!getAuth().currentUser);
      if (getAuth().currentUser) {
        await load_data();
        setUserId(getAuth().currentUser.uid);
      }
    });
  }, []);

  return (
    <div className={`App ${theme} ${userId ? "" : "empty"}`}>
      <SlideScreen
        close={() => console.log("no, lol")}
        shown={iseDeleting}
        closeButton={false}
        closeWhenClickingOutside={false}
      >
        {iseDeleting ? <Loading /> : null}
      </SlideScreen>
      {isLoggedIn ? (
        <BrowserRouter>
          <ScrollWrapper>
            <ThemeContext.Provider value={theme}>
              <nav className="navbar">
                <div className="logo">
                  <img src={logo} alt="logo" className="logo-picture" />
                  <img
                    src={photo}
                    alt="user photo"
                    className="profile-picture"
                  />
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
                      sign_out={sign_out}
                    />
                  }
                />
                {rottenDays.map((day) => (
                  <Route
                    key={day}
                    path={`/days/${day}`}
                    element={
                      <DayPage
                        sets={data}
                        date={day}
                        delete_set={delete_set}
                        rename_set={rename_set}
                      />
                    }
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
                        delete_set={delete_set}
                        rename_set={rename_set}
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
                  element={
                    <Test
                      update_set={update}
                      create_set={create}
                      upload_files={upload_files}
                    />
                  }
                />
                <Route path="/info" element={<About />} />
              </Routes>
            </ThemeContext.Provider>
          </ScrollWrapper>
        </BrowserRouter>
      ) : (
        <button className="sign-in" onClick={sign_in}>
          log in
        </button>
      )}
    </div>
  );
}

export default App;
