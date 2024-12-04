# Chrome Extension: Semantics Search With Google Gemini

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Visit-brightgreen.svg)](https://chromewebstore.google.com/detail/semantic-search-with-genm/hnjmloccdlhfhecmkemojkpmjhefpeee?hl=en-US&utm_source=ext_sidebar)
[![Demo Video](https://img.shields.io/badge/Demo-Video-red.svg)](https://www.youtube.com/watch?v=your-video-id)

A cutting-edge Chrome extension leveraging Google's Gemini model to perform semantic keyword searches on websites. Users can search for keywords, highlight occurrences, and navigate through results seamlessly.

![Extension Preview](cover.png)

---

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Installation](#installation)
---

## Overview

This extension enhances your browsing experience with advanced search capabilities. When a keyword is provided:
- The **Google Gemini model** is used to perform semantic searches on website content.
- Context is extracted from the website, and related segments are returned.
- Matched segments are **highlighted** and can be navigated easily using the **auto-jump** functionality.

Additionally:
- **Exact Match Search**: A shortcut like `Ctrl + F` for finding exact matches.
- **Semantic Search**: Easily toggle between exact and semantic search modes.
- **Keyboard Shortcut Support**: 
  - `Cmd + Shift + Y` for Mac
  - `Ctrl + Shift + Y` for Windows

---

## Features

- **Google Gemini Integration**: Perform semantic searches on websites and PDFs.
- **Keyword Highlighting**: Quickly spot important information.
- **Auto-Jump Navigation**: Navigate through matched results seamlessly.
- **Exact Match Mode**: Switch to traditional search functionality.
- **Shortcut Support**: Quickly activate the extension with keyboard shortcuts.
- **Intuitive UI**: Simple and efficient popup interface.

---

## Installation

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Steps to Install
1. Clone the Repository:
   ```bash
   git clone https://github.com/Yez626/google_ext_link.git
   cd google_ext_link
2. install the following Dependencies
   npm install mark
   npx webpack