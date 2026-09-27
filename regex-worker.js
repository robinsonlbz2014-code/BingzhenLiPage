// Run untrusted regular expressions off the UI thread; the caller enforces a timeout.
self.onmessage = ({ data }) => {
  try {
    const re = new RegExp(data.pattern, data.flags),
      matches = [];
    let m;
    while ((m = re.exec(data.text)) !== null) {
      matches.push({
        match: m[0],
        index: m.index,
        groups: m.slice(1),
        namedGroups: m.groups || null,
      });
      if (!re.global && !re.sticky) break;
      if (matches.length >= 1000) {
        self.postMessage({ matches, truncated: true });
        return;
      }
      if (m[0] === "") {
        const c = data.text.codePointAt(re.lastIndex);
        re.lastIndex += re.unicode && c > 65535 ? 2 : 1;
      }
    }
    self.postMessage({ count: matches.length, matches });
  } catch (e) {
    self.postMessage({ error: e.message });
  }
};
