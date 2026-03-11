import {
  useCallbackLogger,
  useEffectLogger,
  useMemoLogger,
  useStateLogger,
  withLogger,
} from "react-flow-logger";

type Post = {
  id: number;
  title: string;
  body: string;
};

function App() {
  const [posts, setPosts] = useStateLogger<Post[]>("posts", []);
  const [loading, setLoading] = useStateLogger("loading", false);
  const [error, setError] = useStateLogger<string | null>("error", null);

  const [filter, setFilter] = useStateLogger("filter", "");
  const [sortAsc, setSortAsc] = useStateLogger("sortAsc", true);
  const [counter, setCounter] = useStateLogger("counter", 0);

  const fetchPosts = useCallbackLogger("fetchPosts", async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        "https://jsonplaceholder.typicode.com/posts?_limit=5",
      );

      if (!res.ok) {
        throw new Error("Errore API");
      }

      const data: Post[] = await res.json();
      setPosts(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffectLogger("initial fetch", () => {
    fetchPosts();
  }, [fetchPosts]);

  const filteredPosts = useMemoLogger("filteredPosts", () => {
    return posts.filter((p) =>
      p.title.toLowerCase().includes(filter.toLowerCase()),
    );
  }, [posts, filter]);

  const sortedPosts = useMemoLogger("sortedPosts", () => {
    return [...filteredPosts].sort((a, b) =>
      sortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title),
    );
  }, [filteredPosts, sortAsc]);

  const increment = useCallbackLogger("incrementCounter", () => {
    setCounter((c) => c + 1);
  }, [counter]);

  return (
    <div style={{ padding: 32, fontFamily: "sans-serif" }}>
      <h1>React Flow Logger Playground</h1>

      <div style={{ marginBottom: 20 }}>
        <button onClick={fetchPosts} type="button">
          🔄 Fetch Posts
        </button>

        <button
          onClick={() => setSortAsc((s) => !s)}
          style={{ marginLeft: 10 }}
          type="button"
        >
          Toggle Sort
        </button>

        <button onClick={increment} style={{ marginLeft: 10 }} type="button">
          Counter: {counter}
        </button>
      </div>

      <input
        placeholder="Filter posts..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{
          padding: 8,
          marginBottom: 20,
          width: 300,
        }}
      />

      {loading && <p>Loading...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <ul>
          {sortedPosts.map((post) => (
            <li key={post.id} style={{ marginBottom: 16 }}>
              <strong>{post.title}</strong>
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const LoggedApp = withLogger(App);

export default LoggedApp;
