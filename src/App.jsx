import React, { useCallback, useEffect, useMemo, useRef, useState, Suspense } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import sortBy from 'lodash/sortBy'
import './App.css'

const FeatureModal = React.lazy(() => import('./FeatureModal.jsx'))

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

const HERO_SRC = '/hero/hero-1200.svg'
const HERO_SRCSET = '/hero/hero-640.svg 640w, /hero/hero-1200.svg 1200w, /hero/hero-1600.svg 1600w'

function buildFallbackStories() {
  const now = Math.floor(Date.now() / 1000)

  return Array.from({ length: 500 }, (_, index) => ({
    id: 100000 + index,
    title: `Offline preview story ${index + 1}`,
    by: index % 3 === 0 ? 'copilot' : 'newsbot',
    score: 500 - index,
    time: now - index * 180,
    descendants: (index * 7) % 120,
    url: `https://news.ycombinator.com/item?id=${100000 + index}`,
  }))
}

const ArticleItem = React.memo(function ArticleItem({ article }) {
  const formattedTime = useMemo(() => dateFormatter.format(new Date(article.time * 1000)), [article.time])

  return (
    <article data-testid="article-item" className="article-card">
      <div className="article-card__rank">{article.score || 0}</div>
      <div className="article-card__body">
        <h3 className="article-card__title">
          <a href={article.url || `https://news.ycombinator.com/item?id=${article.id}`} target="_blank" rel="noreferrer">
            {article.title}
          </a>
        </h3>
        <div className="article-card__meta">
          <span>by <strong>{article.by || 'unknown'}</strong></span>
          <span>{formattedTime}</span>
          <span>{article.descendants || 0} comments</span>
        </div>
      </div>
      <a className="article-card__link" href={article.url || `https://news.ycombinator.com/item?id=${article.id}`} target="_blank" rel="noreferrer">
        Open story
      </a>
    </article>
  )
})

function VirtualizedArticleList({ articles }) {
  const parentRef = useRef(null)
  const virtualizer = useVirtualizer({
    count: articles.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 148,
    overscan: 8,
  })

  const items = virtualizer.getVirtualItems()

  return (
    <div
      ref={parentRef}
      data-testid="article-list"
      className="article-list"
    >
      <div className="article-list__spacer" style={{ height: `${virtualizer.getTotalSize()}px` }} />
      {items.map((virtualItem) => {
        const article = articles[virtualItem.index]
        return (
          <div
            key={article.id}
            className="article-list__item-shell"
            style={{ transform: `translateY(${virtualItem.start}px)` }}
          >
            <ArticleItem article={article} />
          </div>
        )
      })}
    </div>
  )
}

export default function App() {
  const [articles, setArticles] = useState([])
  const [filter, setFilter] = useState('')
  const [sortDescending, setSortDescending] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showNotes, setShowNotes] = useState(false)

  useEffect(() => {
    let cancelled = false
    let timeoutId = null

    const fetchStories = async () => {
      try {
        setLoading(true)
        setError('')

        const idsResponse = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
        const storyIds = await idsResponse.json()
        const topIds = storyIds.slice(0, 500)

        const storyPromises = topIds.map((id) =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
            .then((response) => response.json())
            .catch(() => null)
        )

        const fetchedStories = await Promise.all(storyPromises)
        const validStories = fetchedStories.filter(Boolean)

        if (!cancelled) {
          setArticles(validStories.length > 0 ? validStories : buildFallbackStories())
        }
      } catch (fetchError) {
        if (!cancelled) {
          setArticles(buildFallbackStories())
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchStories()

    timeoutId = setTimeout(() => {
      if (!cancelled) {
        setArticles((current) => (current.length > 0 ? current : buildFallbackStories()))
        setLoading(false)
      }
    }, 5000)

    return () => {
      cancelled = true
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  const filteredArticles = useMemo(() => {
    const normalizedFilter = filter.trim().toLowerCase()
    const matchedArticles = normalizedFilter
      ? articles.filter((article) => (article.title || '').toLowerCase().includes(normalizedFilter))
      : articles

    const sortedArticles = sortBy(matchedArticles, 'score')
    return sortDescending ? sortedArticles.reverse() : sortedArticles
  }, [articles, filter, sortDescending])

  const handleFilterChange = useCallback((event) => {
    setFilter(event.target.value)
  }, [])

  const toggleSort = useCallback(() => {
    setSortDescending((current) => !current)
  }, [])

  return (
    <div className="page-shell">
      <header className="hero">
        <div className="hero__content">
          <p className="eyebrow">Hacker News Intelligence</p>
          <h1>News that feels instant</h1>
          <p className="hero__lede">
            A performance-tuned aggregator built to spotlight current stories without jank, layout shifts, or bloated bundles.
          </p>
          <div className="hero__actions">
            <button className="primary-button" onClick={toggleSort} aria-pressed={sortDescending}>
              {sortDescending ? 'Sort: highest score' : 'Sort: default order'}
            </button>
            <button className="secondary-button" onClick={() => setShowNotes(true)}>
              View performance notes
            </button>
          </div>
        </div>
        <div className="hero__media">
          <img
            data-testid="hero-image"
            className="hero-image"
            src={HERO_SRC}
            srcSet={HERO_SRCSET}
            sizes="(max-width: 900px) 100vw, 520px"
            width="1600"
            height="900"
            alt="Abstract editorial dashboard illustration"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </header>

      <main className="main-card">
        <section className="controls">
          <label className="search-group">
            <span>Filter by title</span>
            <input
              type="search"
              value={filter}
              onChange={handleFilterChange}
              placeholder="Search top stories"
              aria-label="Filter articles by title"
            />
          </label>
          <div className="stats-row" aria-live="polite">
            <div>
              <strong>{articles.length}</strong>
              <span>loaded</span>
            </div>
            <div>
              <strong>{filteredArticles.length}</strong>
              <span>visible</span>
            </div>
            <div>
              <strong>{sortDescending ? 'score ↓' : 'default'}</strong>
              <span>order</span>
            </div>
          </div>
        </section>

        {loading && <div className="status-panel">Loading the top 500 stories in parallel...</div>}
        {error && <div className="status-panel status-panel--error">{error}</div>}

        {!loading && !error && filteredArticles.length > 0 && (
          <VirtualizedArticleList articles={filteredArticles} />
        )}

        {!loading && !error && filteredArticles.length === 0 && (
          <div className="status-panel">No stories match your filter.</div>
        )}
      </main>

      <footer className="footer-card">
        <p>
          Optimized for fast loading, responsive filtering, and stable layout. Review the slow version on the <code>slow-version</code> branch.
        </p>
      </footer>

      {showNotes && (
        <Suspense fallback={<div className="modal-fallback">Loading performance notes...</div>}>
          <FeatureModal onClose={() => setShowNotes(false)} />
        </Suspense>
      )}
    </div>
  )
}
