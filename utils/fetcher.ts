import fetch from 'isomorphic-unfetch';

export  default async function fetcher(url) {
    const res = await fetch(url);
    const json = await res.json();
    return json;
  }