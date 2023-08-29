import React, { useState, useEffect } from 'react';
import './App.css';

import { BsHandThumbsUpFill } from "react-icons/bs"

function App() {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage]);

  const fetchArticles = async (page) => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch(`https://picsum.photos/v2/list?page=${page}`);
      const data = await response.json();
      
      // If it's the first page, clear the articles state
      if (page === 1) {
        setArticles(data);
      } else {
        setArticles((prevArticles) => [...prevArticles, ...data]);
      }
      
      setCurrentPage(page + 1);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleThumbUp = (index) => {
    const newArticles = [...articles];
    newArticles[index].likes = (newArticles[index].likes || 0) + 1;
    setArticles(newArticles);
  };

  const isBottomOfPage = () => {
    return (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    );
  };

  const handleScroll = () => {
    if (isBottomOfPage()) {
      fetchArticles(currentPage);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentPage]);

  return (
    <div className="App">
      <h1>photo gallery</h1>
      <div className="article-list">
        {articles.map((article, index) => (
          <div style={{ display: "flex", padding: "20px", border: "1px solid black", marginTop: "20px" }} className="article" key={index}>

            <img style={{ width: "200px", height: "200px" }} src={article.download_url} alt={article.author} />
            <span style={{ marginTop: "70px", marginLeft: "30px", fontSize: "22px" }}>Author: {article.author}</span>

            <span style={{ marginTop: "70px", marginLeft: "30px", fontSize: "22px",cursor:"pointer" }} onClick={() => handleThumbUp(index)}>
              <BsHandThumbsUpFill size={"20px"} />
              {article.likes || 0}
            </span>

            <p style={{ marginLeft: "1000px",marginTop:"180px" }}>
              {article.id}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
