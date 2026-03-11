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

	const fetchPosts = useCallbackLogger("fetchPosts", async () => {
		try {
			setLoading(true);
			setError(null);

			const res = await fetch(
				"https://jsonplaceholder.typicode.com/posts?_limit=5",
			);

			if (!res.ok) {
				throw new Error("Errore nella risposta API");
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

	const sortedPosts = useMemoLogger("sortedPosts", () => {
		return [...posts].sort((a, b) => a.title.localeCompare(b.title));
	}, [posts]);

	return (
		<div style={{ padding: 32, fontFamily: "sans-serif" }}>
			<h1>React Flow Logger Test</h1>

			<button
				onClick={fetchPosts}
				style={{
					padding: "8px 16px",
					marginBottom: 20,
					cursor: "pointer",
				}}
				type="button"
			>
				🔄 Ricarica
			</button>

			{loading && <p>Caricamento...</p>}

			{error && <p style={{ color: "red" }}>Errore: {error}</p>}

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
