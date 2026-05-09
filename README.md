# 📰 News Performance Optimizer

A comprehensive performance engineering project that demonstrates the process of identifying, measuring, and eliminating web performance bottlenecks. Built with React and focused on Google's Core Web Vitals (LCP, INP, CLS).

## Project Overview

This project simulates a real-world scenario where developers inherit codebases with accumulated "performance debt." You'll work through three phases:

1. **Phase 1**: Build an intentionally slow application demonstrating common anti-patterns
2. **Phase 2**: Establish a baseline performance measurement using Lighthouse and Chrome DevTools
3. **Phase 3**: Systematically optimize the application while documenting each improvement

## Key Concepts

### Core Web Vitals (CWV)
- **LCP (Largest Contentful Paint)**: Loading performance - target < 2.5 seconds
- **INP (Interaction to Next Paint)**: Responsiveness - target < 200 milliseconds  
- **CLS (Cumulative Layout Shift)**: Visual stability - target < 0.1

## Project Structure

```
news-performance-optimizer/
├── src/
│   ├── main.jsx                 # React entry point
│   ├── App.jsx                  # Main application component
│   └── index.css                # Global styles
├── index.html                   # HTML template
├── vite.config.js              # Vite configuration
├── package.json                # Dependencies and scripts
├── Dockerfile                  # Container image definition
├── docker-compose.yml          # Multi-container orchestration
├── PERFORMANCE.md              # Performance audit report
├── README.md                   # This file
└── .env.example               # Environment variables template
```

## Getting Started

### Prerequisites
- Node.js 16+ or Docker

### Installation & Development (Latest Optimized Version)

```bash
# Clone the repository
git clone <repo-url>
cd news-performance-optimizer

# Install dependencies
npm install

# Run development server
npm run dev

# Open in browser
http://localhost:3000
```

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview

# View bundle analysis
npm run analyze
```

### Running with Docker

```bash
# Build and start all services
docker-compose up -d --build

# Check service status
docker-compose ps

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

## Viewing the Slow Version

The initial unoptimized version with anti-patterns is available on the `slow-version` branch:

```bash
# Switch to slow version
git checkout slow-version

# Install and run
npm install
npm run dev

# Build slow version
npm run build
```

### Comparing Performance

1. **Run Lighthouse**:
   - Open Chrome DevTools (F12)
   - Go to Lighthouse tab
   - Select "Performance" and "Generate report"
   - Compare against PERFORMANCE.md baseline

2. **Use Chrome DevTools Performance Panel**:
   - Open DevTools → Performance tab
   - Record user interactions (filtering, sorting)
   - Analyze flame charts for long tasks
   - Check for layout shifts and animations

## Performance Optimizations Implemented

### Phase 3 Improvements

1. **Parallelized Network Requests**
   - Changed from sequential fetching to Promise.all()
   - Dramatically reduced total data-fetching time
   - Impact: Network waterfall eliminated

2. **List Virtualization**
   - Implemented @tanstack/react-virtual
   - Only renders visible items in viewport
   - Reduced DOM nodes from 500+ to ~20
   - Impact: Improved INP significantly

3. **Optimized Dependencies**
   - Cherry-picked lodash imports (lodash/sortBy)
   - Removed unnecessary imports
   - Impact: Reduced bundle size by ~40KB

4. **Image Optimization**
   - Compressed hero image (2MB → ~150KB)
   - Added width, height, srcset attributes
   - Modern format support
   - Impact: LCP improved by 60%+

5. **Code Splitting**
   - Separated vendor chunks
   - Multiple output bundles
   - Impact: Reduced initial payload

6. **Expensive Computation Memoization**
   - Moved date formatting outside render
   - Applied React.memo to ArticleItem
   - Used useMemo for expensive calculations
   - Impact: Faster re-renders

## Performance Metrics

See [PERFORMANCE.md](./PERFORMANCE.md) for detailed baseline and optimization metrics.

### Current Performance (Optimized Version)

- **LCP**: < 1.5s (Down from 8.5s)
- **INP**: < 100ms (Down from 1200ms TBT)
- **CLS**: < 0.05 (Down from 0.45)
- **Bundle Size**: ~150KB (Down from 450KB)

## Features

### Slow Version (Phase 1)
- ❌ Sequential data fetching (500+ requests)
- ❌ All 500 articles rendered in DOM
- ❌ Unoptimized hero image
- ❌ Inefficient dependencies
- ❌ No list virtualization
- ❌ No code splitting

### Optimized Version (Phase 3)
- ✅ Parallel data fetching with Promise.all
- ✅ Virtual scrolling (only ~20 items in DOM)
- ✅ Optimized images with srcset
- ✅ Cherry-picked imports
- ✅ React.memo and useMemo applied
- ✅ Code splitting enabled

## Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build locally
npm run analyze     # Generate and open bundle analysis
```

## Docker Configuration

### docker-compose.yml
- Builds and serves the application
- Exposes port 3000
- Includes health checks
- Single-stage build for simplicity

### Dockerfile
- Multi-stage build
- Optimized for production
- Node.js 18 Alpine base image
- Minimized final image size

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Best Practices Applied

1. ✅ Core Web Vitals optimization
2. ✅ Network request parallelization
3. ✅ DOM size minimization via virtualization
4. ✅ Image optimization with modern formats
5. ✅ Bundle size reduction via code splitting
6. ✅ Dependency optimization
7. ✅ Render performance optimization
8. ✅ Layout shift prevention

## Tools Used

- **Vite**: Fast build tool and dev server
- **React 18**: UI framework
- **@tanstack/react-virtual**: List virtualization
- **Chrome DevTools**: Performance profiling
- **Lighthouse**: Automated auditing
- **vite-plugin-visualizer**: Bundle analysis

## Learning Outcomes

After completing this project, you'll understand:

- How to measure and profile web applications
- Core Web Vitals and their impact on user experience
- Network optimization techniques
- DOM performance and virtualization
- Image optimization strategies
- Bundle size analysis and code splitting
- React performance optimization patterns
- Containerization and deployment

## Troubleshooting

### Build Fails
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port Already in Use
```bash
# Change port in .env or vite.config.js
PORT=3001 npm run dev
```

### Slow Performance
Check that you're running the optimized version:
```bash
git branch
# Should show * main (or master)
# Not * slow-version
```

**Remember**: Performance is a feature. Every millisecond matters to user experience and SEO ranking! 🚀
