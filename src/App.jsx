import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import './App.css'

// ANTI-PATTERN: Expensive computations directly in render (no memoization)
function ArticleItem({ article }) {
  // ANTI-PATTERN: Expensive date formatting without memoization
  const formattedTime = new Date(article.time * 1000).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  return (
    <div data-testid="article-item" className="article-item">
      <div className="article-header">
        <h3>
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        </h3>
      </div>
      <div className="article-meta">
        <span className="score">👍 {article.score || 0}</span>
        <span className="author">by {article.by || 'Anonymous'}</span>
        <span className="time">{formattedTime}</span>
      </div>
    </div>
  )
}

export default function App() {
  const [articles, setArticles] = useState([])
  const [filter, setFilter] = useState('')
  const [sortByScore, setSortByScore] = useState(false)
  const [loading, setLoading] = useState(true)

  // ANTI-PATTERN: Sequential/waterfall data fetching (N+1 problem)
  useEffect(() => {
    const fetchAllStories = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
        const storyIds = await response.json()

        const stories = []
        // ANTI-PATTERN: Sequential fetching in a loop - huge performance hit!
        for (const id of storyIds.slice(0, 500)) {
          const storyResp = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
          const storyData = await storyResp.json()
          stories.push(storyData)
        }

        setArticles(stories)
      } catch (error) {
        console.error('Error fetching stories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllStories()
  }, [])

  // ANTI-PATTERN: Using entire lodash library instead of cherry-picked imports
  let displayArticles = articles

  if (filter.trim()) {
    displayArticles = articles.filter(article =>
      article.title?.toLowerCase().includes(filter.toLowerCase())
    )
  }

  if (sortByScore) {
    // ANTI-PATTERN: Using _.sortBy from full lodash import
    displayArticles = _.sortBy(displayArticles, 'score').reverse()
  }

  return (
    <div className="app-container">
      {/* ANTI-PATTERN: Large, unoptimized hero image without attributes */}
      <div className="hero-section">
        <img
          src="https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=400&fit=crop"
          alt="News"
          className="hero-image"
        />
      </div>

      <div className="content-wrapper">
        <header className="app-header">
          <h1>📰 News Performance Optimizer</h1>
          <p>Hacker News Aggregator - Deliberately Slow Version (Phase 1)</p>
        </header>

        <div className="controls">
          <div className="filter-section">
            <input
              type="text"
              placeholder="Filter articles by title..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="sort-section">
            <button
              onClick={() => setSortByScore(!sortByScore)}
              className={`sort-button ${sortByScore ? 'active' : ''}`}
            >
              {sortByScore ? '⬇️ Sort: Score (High→Low)' : '⬆️ Sort: Default'}
            </button>
          </div>
        </div>

        {loading && <div className="loading">Loading stories... (This takes a LONG time due to sequential requests)</div>}

        <div data-testid="article-list" className="articles-list">
          {displayArticles.map((article) => (
            <ArticleItem key={article.id} article={article} />
          ))}
        </div>

        <div className="footer">
          <p>Total articles loaded: {articles.length}</p>
          <p>Articles displayed: {displayArticles.length}</p>
          <p style={{ fontSize: '0.9em', color: '#999', marginTop: '1rem' }}>
            ⚠️ This is the intentionally slow version (Phase 1). Check out the optimized version for comparison!
          </p>
        </div>
      </div>
    </div>
  )
}
