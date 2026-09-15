import { useEffect, useState } from "react";
import { searchUsers } from "../../api/functions/search.js";
import { useTitle } from "../../utilis/helpers.js";
import UserCard from "../../components/UserCard.jsx";
import Loader from "../../components/Loader.jsx";
import styles from "../../styles/features/search/SearchPage.module.css";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  useTitle("Search");

  useEffect(() => {
    if (query.trim().length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUsers([]);
      setLoading(false);
      return;
    }

    const abortController = new AbortController();

    const main = async () => {
      try {
        setLoading(true);
        const result = await searchUsers(query, abortController);
        setUsers(result || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    main();

    return () => {
      abortController.abort();
    };
  }, [query]);

  /* Empty and search helper states */
  const emptyState =
    query.trim().length > 0 ? (
      <div className={styles["search-page__empty-state"]}>
        <i
          className={`bi bi-person-x ${styles["search-page__empty-icon"]}`}
          aria-hidden="true"
        />
        <h2 className={styles["search-page__empty-title"]}>No results</h2>
        <p className={styles["search-page__empty-desc"]}>
          There were no users found for "{query}".
        </p>
      </div>
    ) : (
      <div className={styles["search-page__empty-state"]}>
        <i
          className={`bi bi-people ${styles["search-page__empty-icon"]}`}
          aria-hidden="true"
        />
        <h2 className={styles["search-page__empty-title"]}>Search Users</h2>
        <p className={styles["search-page__empty-desc"]}>
          Type a name, ID, or username in the field above to start searching.
        </p>
      </div>
    );

  const searchResult =
    users.length > 0 ? (
      <div className={styles["search-page__results"]}>
        <header className={styles["search-page__results-header"]}>
          <h2 className={styles["search-page__results-count"]}>
            Found {users.length} {users.length === 1 ? "user" : "users"}
          </h2>
        </header>

        <ul className={styles["search-page__list"]}>
          {users.map((u) => (
            <li key={u.id} className={styles["search-page__item"]}>
              <UserCard user={u} />
            </li>
          ))}
        </ul>
      </div>
    ) : (
      emptyState
    );

  return (
    <main id="app-content" aria-labelledby="search-page-heading">
      <div className="content-wrapper">
        <header className={styles["search-page__header"]}>
          <h1 id="search-page-heading" className={styles["search-page__title"]}>
            User Search
          </h1>
          <form
            className={styles["search-page__form"]}
            onSubmit={(e) => e.preventDefault()}
          >
            <div className={styles["search-page__input-wrapper"]}>
              <i
                className={`bi bi-search ${styles["search-page__search-icon"]}`}
                aria-hidden="true"
              />
              <label htmlFor="user-search-input" className="sr-only">
                Search users
              </label>
              <input
                id="user-search-input"
                type="text"
                name="search"
                className={styles["search-page__input"]}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search users..."
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  className={styles["search-page__clear-btn"]}
                  onClick={() => setQuery("")}
                  aria-label="Clear search field"
                >
                  <i className="bi bi-x-lg" aria-hidden="true" />
                </button>
              )}
            </div>
          </form>
        </header>

        <div className={styles["search-page__content"]}>
          {loading ? (
            <Loader className={styles["search-page__loader"]} />
          ) : (
            searchResult
          )}
        </div>
      </div>
    </main>
  );
}

export default SearchPage;
