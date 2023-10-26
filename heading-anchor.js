const md = require('markdown-it')();

function headingAnchor(md) {
  md.renderer.rules.heading_open = function(tokens, idx, options, env, self) {
    const token = tokens[idx];
    const title = token.children.reduce((acc, t) => acc + t.content, '');
    const anchor = title.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();
    const content = `<a href="#${anchor}" class="no-underline relative"><span aria-hidden="true" x-data="{ tooltip: false }" class="text-base absolute left-0 top-1/2 transform -translate-y-1/2 opacity-0 transition-opacity duration-200">🔗</span></a>`;
    const toc = options.toc;
    toc.push({ level: token.tag.slice(1), anchor, title });
    return `<h${token.tag.slice(1)} id="${anchor}">${content}${token.markup}`;
  };

  md.renderer.rules.heading_close = function(tokens, idx, options, env, self) {
    const toc = options.toc;
    const lastToc = toc[toc.length - 1];
    const level = lastToc.level;
    toc.pop();
    return `</h${level}>`;
  };

  md.renderer.rules.html_block = function(tokens, idx, options, env, self) {
    const token = tokens[idx];
    if (token.content.trim() === '[[_toc_]]') {
      const toc = options.toc.map((item) => {
        const { level, anchor, title } = item;
        return `${'  '.repeat(level - 2)}- [${title}](#${anchor})`;
      });
      return `<div class="table-of-contents">\n${toc.join('\n')}\n</div>`;
    }
    return token.content;
  };
}

const toc = [];

md.use(headingAnchor, { toc });

module.exports = md;
