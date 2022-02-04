

class PostItem extends React.Component {
	constructor(props) {
		super(props);
		this.handle_click = this.handle_click.bind(this);
	}


	render() {
		return React.createElement(
			'div',
			{ className: 'PostItem', 'data-id': this.props.post.id },
			React.createElement(
				'span',
				null,
				React.createElement('i', { onClick: this.handle_click, className: 'fa fa-times transparent' })
			),
			React.createElement(
				'span',
				null,
				this.props.post.text
			)
		);
	}
}

class PostList extends React.Component {
	constructor(props) {
		super(props);
		this.handle_delete = this.handle_delete.bind(this);
		this.state = { posts: [] };
	}

	async componentDidMount() {
		const posts = await this.fetch_posts();
		this.update_list(posts);
	}

	async fetch_posts() {
		const response = await fetch('/api/posts');
		if (response.status != 200) throw new Error('Error while fetching users');
		const data = await response.json();
		return data;
	}

	update_list(posts) {
		this.setState({ posts: posts });
	}

	render() {
		return React.createElement(
			'div',
			null,
			this.state.posts.map((item, index) => {
				return React.createElement(PostItem, {
					handle_delete: this.handle_delete, post: item, key: index });
			})
		);
	}
}
