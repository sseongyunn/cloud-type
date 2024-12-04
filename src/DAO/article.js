const { runQuery } = require("../lib/database");

const formatDate = date => {
    if (!date || !(date instanceof Date)) {
        console.error('Invalid date:', date);
        return 'Invalid Date'; // 기본값 반환
    }

    const yr = date.getFullYear();
    const mon = date.getMonth() + 1;
    const dt = date.getDate();
    const hrs = date.getHours();
    const mins = date.getMinutes();
    const secs = date.getSeconds();
    return `${yr}. ${mon}. ${dt} ${hrs}:${mins}:${secs}`;
};

const replaceDate = article => {
    if (article) {
        article.createdAt = formatDate(article.createdAt);
        article.lastUpdated = formatDate(article.lastUpdated);
    }
    return article;
};

//sql문에서 a.created_at AS createAt으로 되어 있었는데 얘를 createdAt으로 바꿔줌

const getList = async (start, count) => {
    const sql = 'SELECT a.id, a.title, a.created_at AS createdAt, a.last_updated AS lastUpdated, u.display_name AS displayName '+
    'FROM articles AS a INNER JOIN users AS u '+
    'ON a.author = u.id AND a.is_active = 1 AND a.is_deleted = 0 '+
    'ORDER BY a.id DESC LIMIT ?, ?';

    const articles = await runQuery(sql, [start,count]);
    return articles.map(replaceDate);
};

const getTotalCount = async () => {
    const sql = 'SELECT Count(*) AS articleCount FROM articles '+
    'WHERE is_active = 1 AND is_deleted = 0';

    const articleCount = (await runQuery(sql))[0];

    return articleCount;
};

const getById = async (id) => {
    const sql = 'SELECT a.id, a.title, a.content, a.author, a.created_at AS createdAt, a.last_updated AS lastUpdated, u.display_name AS displayName '+
    'FROM articles AS a INNER JOIN users AS u '+
    'ON a.author = u.id AND a.is_active = 1 AND a.is_deleted = 0 AND a.id = ?';

    const articles = await runQuery(sql, [id]);

    return replaceDate(articles[0]);
};

const getByIdAndAuthor = async (id, author) => {
    const sql = 'SELECT title, content, author, created_at AS createdAt, last_updated AS lastUpdated '+
    'FROM articles '+
    'WHERE is_active = 1 AND is_deleted = 0 AND id = ? AND author = ?';

    const articles = await runQuery(sql, [id, author.id]);

    return replaceDate(articles[0]);
};

const create = async (title, content, author) => {
    const sql = 'INSERT INTO articles (title, content, author) VALUES (?, ?, ?)'
    const {insertId} = await runQuery(sql, [title, content, author.id]);
    return insertId;
};

const update = async (id, title, content) => {
    const sql = 'UPDATE articles SET title = ?, content = ? WHERE id = ?';
    await runQuery(sql, [title, content, id]);
};

const remove = async (id) => {
    const sql = 'UPDATE articles SET is_deleted = 1 WHERE id = ?';
    await runQuery(sql, [id]);
};

module.exports = {
    getList,
    getTotalCount,
    getById,
    getByIdAndAuthor,
    create,
    update,
    remove,
};