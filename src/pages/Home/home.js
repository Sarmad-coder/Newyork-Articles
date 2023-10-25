import { useState } from "react";
import logo from "./logo.png"
import Select from 'react-select';
import { useSpring, animated } from '@react-spring/web'
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { APIURL } from "../../BaseUrl";
import axios from "axios";
import { useEffect } from "react";
import { Link } from "react-router-dom";




export default () => {
    let [articles, setArticles] = useState({});
    let [sections, setSections] = useState({});
    let [loader,setLoader]=useState(true);

    const getTopArticles = async () => {
        try {
            let resp = await axios.get(APIURL + "article/topArticle");


            if (resp.status === 200 && resp.data.data) {
                articles = (resp.data.data)
                setArticles(articles);
                console.log(articles)
                setLoader(false)

                const newSections = {};

                articles.results.forEach(item => {
                    const section1 = item.section;
                    const subsection = item.subsection;

                    if (section1) {
                        if (!newSections[section1]) {
                            newSections[section1] = {};
                        }

                        if (!newSections[section1][subsection]) {
                            newSections[section1][subsection] = [];
                        }

                        newSections[section1][subsection].push(item);
                    }
                });

                setSections(newSections);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getTopArticles();
    }, []);

    return (
        <div>
            


            {loader ?<div className=" tw-flex tw-flex-col tw-justify-center tw-items-center tw-h-screen">
                <div class="spinner-grow tw-w-36 tw-h-36" role="status">
                </div>
                <div class="sr-only tw-font-bold tw-text-2xl">Loading...</div>
            </div> : 
            <div>
            {Object.keys(sections).map((section1, index) => (
                <div key={index}>
                    <h1 className=" tw-font-bold tw-text-4xl tw-text-center">{section1}</h1>
                    {Object.keys(sections[section1]).map((subsection, subIndex) => (
                        <div key={subIndex}>
                            {subIndex === 0 && (
                                <h3 className="tw-font-bold tw-text-2xl tw-text-center tw-my-8">{subsection}</h3>
                            )}
                            {sections[section1][subsection].map((article, articleIndex) => (
                                <div key={articleIndex}>





                                    <div className=" tw-flex tw-justify-center tw-my-4">
                                        <div className="card lg:tw-w-[900px]">
                                            <img className="card-img-top" src={article.multimedia[0].url} alt="Card image cap" />
                                            <div className="card-body">
                                                <h5 className="card-title tw-font-bold">{article.title}</h5>
                                                <p className="card-text">
                                                    {article.abstract}
                                                </p>
                                                <a href={article.url} className="btn btn-primary tw-mt-4">
                                                    See full article
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Include other details about the article here */}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}

            <h1 className=" tw-font-bold tw-text-4xl tw-text-center tw-mt-16 tw-mb-2">{articles.copyright}</h1>
        </div>}
        </div>
    );
}

