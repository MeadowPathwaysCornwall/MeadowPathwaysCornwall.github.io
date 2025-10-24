@@ -12,30 +12,40 @@ body {
  line-height: 1.6;
}

/* Logo */
header img.logo {
  height: 120px; /* larger logo */
  display: block;
  margin: 1em auto;
}

/* Navigation */
header nav ul {
  list-style: none;
  display: flex;
  justify-content: space-around;
  background: #4b2e83; /* Heavy Purple */
  justify-content: center;
  background: linear-gradient(90deg, #2a9d8f, #264653); /* teal/blue */
  margin: 0;
  padding: 0;
}

header nav ul li {
  flex: 1;
  margin: 0;
}

header nav ul li a {
  display: block;
  padding: 1em;
  text-align: center;
  padding: 1.5em 2em; /* oversized tabs */
  font-size: 1.2em;
  color: #fff;
  text-decoration: none;
  transition: background 0.3s ease;
  transition: background 0.3s ease, color 0.3s ease;
}

header nav ul li a.active,
header nav ul li a:hover {
  background: #6a4fb3; /* Medium Purple */
  background: #e63946; /* red accent */
  color: #fff;
}

/* Carousel */
@@ -89,7 +99,7 @@ header nav ul li a:hover {
}

.carousel-dots span.active {
  background: #4b2e83;
  background: #e63946; /* red accent */
}

/* Welcome Section */
@@ -103,7 +113,7 @@ main.welcome {
}

main.welcome h1 {
  color: #4b2e83;
  color: #264653; /* deep blue/green */
  text-align: center;
  margin-bottom: 1em;
  font-size: 2em;
@@ -116,12 +126,12 @@ main.welcome p {

/* Links */
a {
  color: #4b2e83;
  color: #2a9d8f;
  text-decoration: underline;
}

a:hover {
  color: #6a4fb3;
  color: #e63946; /* red accent */
}

/* Footer */
