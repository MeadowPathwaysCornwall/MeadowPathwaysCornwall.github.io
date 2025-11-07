/* --- General Reset & Body --- */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: #f7f8fa;
  color: #333;
  line-height: 1.6;
  margin: 0;
}

a {
  text-decoration: none;
  color: inherit;
}

a:focus, a:hover {
  color: var(--accent-green);
}

.blugoon-body {
  background-color: #fff;
}

/* --- Colors & Variables --- */
:root {
  --blugoon-blue: #0075b3;
  --blugoon-light: #d9eef6;
  --accent-green: #62b960;
  --text-soft: #7d7d7d;
  --footer-bg: #f0f1f6;
  --footer-text: #333;
}

.hero-overlay {
  background: rgba(0, 0, 0, 0.5);
  padding: 3rem 0;
  text-align: center;
}

.hero-overlay h1 {
  font-size: 3rem;
  color: white;
}

.hero-overlay p {
  font-size: 1.2rem;
  color: white;
}

.site-header {
  background-color: var(--blugoon-blue);
  color: #fff;
  padding: 1rem 0;
}

.site-header .primary-nav {
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-tabs {
  list-style: none;
  display: flex;
  padding: 0;
}

.nav-tabs li {
  margin: 0 1.5rem;
}

.nav-tabs a {
  color: white;
  font-size: 1.1rem;
}

.nav-tabs .active {
  font-weight: bold;
  text-decoration: underline;
}

.nav-toggle {
  background-color: var(--blugoon-blue);
  border: none;
  color: white;
  padding: 10px;
  cursor: pointer;
}

.site-footer {
  background-color: var(--footer-bg);
  text-align: center;
  padding: 2rem 0;
}

.site-footer p {
  color: var(--footer-text);
}

.footer-logo {
  width: 150px;
  margin-bottom: 1rem;
}

/* --- Carousel --- */
.carousel {
  display: flex;
  overflow: hidden;
  position: relative;
  width: 100%;
}

.carousel-images {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.carousel-images img {
  width: 100%;
  max-width: 100%;
  display: block;
}

.carousel-nav {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
}

.carousel-prev, .carousel-next {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
}

/* --- News Ticker --- */
.news-reel {
  white-space: nowrap;
  overflow: hidden;
}

.news-reel span {
  animation: ticker 15s linear infinite;
}

@keyframes ticker {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

/* --- Layout & Spacing --- */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-wrap {
  padding: 3rem 0;
}

.wrap {
  margin-bottom: 3rem;
}

.card {
  background-color: #fff;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.card h1, .card h2 {
  color: var(--blugoon-blue);
  margin-bottom: 1rem;
}

.card p {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.card ul {
  padding-left: 20px;
  list-style-type: square;
}

.card .emoji-list {
  padding-left: 0;
}

.card a {
  font-weight: bold;
  color: var(--accent-green);
}

/* --- Sidebar --- */
.sidebar {
  width: 300px;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  background-color: var(--blugoon-blue);
  color: white;
  padding-top: 2rem;
  z-index: 10;
}

.sidebar-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sidebar-logo {
  width: 200px;
  margin-bottom: 2rem;
}

.side-nav {
  list-style: none;
  padding: 0;
}

.side-nav li {
  margin: 1.2rem 0;
}

.side-nav a {
  color: white;
  font-size: 1.2rem;
}

.side-nav a:hover {
  text-decoration: underline;
}

/* --- Forms & Buttons --- */
input[type="text"], input[type="email"], input[type="password"], textarea {
  width: 100%;
  padding: 1rem;
  margin: 0.8rem 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

button, .submit-btn {
  padding: 1rem 2rem;
  background-color: var(--accent-green);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

button:hover, .submit-btn:hover {
  background-color: #4b8e3d;
}

.form-actions {
  text-align: center;

}

/* Back to top button */
#backToTop {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background-color: var(--accent-green);
  color: white;
  padding: 1rem;
  border-radius: 50%;
  cursor: pointer;
}

#backToTop:hover {
  background-color: #4b8e3d;
}

@media screen and (max-width: 768px) {
  .primary-nav ul {
    display: none;
  }

  .nav-toggle {
    display: block;
  }

  #primaryNav {
    display: flex;
    flex-direction: column;
  }

  .nav-tabs {
    list-style: none;
    padding: 0;
  }

  .nav-tabs li {
    margin: 0.5rem 0;
  }

  .sidebar {
    width: 100%;
    height: auto;
    position: static;
    padding: 1rem;
  }
}

