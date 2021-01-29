import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './Main.css';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectPostId: null,
      posts: [],
      title: "",
      body: "",
      formShow: false,
      isLoading: false
    }
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangebody = this.handleChangebody.bind(this);
  }

  async componentDidMount() {
    this.setState({ isLoading: true })

    const response = await fetch("https://jsonplaceholder.typicode.com/posts")
    if (response.ok) {
      let userPosts = await response.json()
      userPosts = userPosts.map((item) => {
        return { 
          id : item.id,
          title : item.title,
          body : item.body,
          showHide: false,
          editButtonShow: true
        }
      })
      this.setState({ posts: userPosts, isLoading: false });
    } else {
      this.setState({ isLoading: false })
    }
  }

  handleChangeTitle(event) {
    this.setState({title: event.target.value})
  }
  handleChangebody(event){
    this.setState({body: event.target.value})
  }
  handleClick(id) {
    //const {showHide} = this.state;
    //this.setState({showHide: !showHide})

    const posts = [...this.state.posts];

    if (this.state.selectPostId) {
      this.setState({ ...this.state,  selectPostId: null })
    } else {
      posts.map((item) => {
        if(item.id === id){
          item.showHide = true;
        }
      })

      const postIndex = posts.findIndex((item) => item.id === id);

      if(postIndex !== -1){
        posts[postIndex].editButtonShow = false;
        posts[postIndex].formShow = true;
      }
      this.setState({...this.state,  selectPostId: id, posts: posts})
    }
  }

  saveData(id) {
    const posts = [...this.state.posts]
    posts.map((item) =>{
      if(item.id === id){
        item.title = this.state.title;
        item.body = this.state.body; 
        item.formShow = false;
        this.setState({formShow: false})
      }
    })

    const postSave = posts.findIndex((item) => item.id === id);
    if(postSave !== -1){
      posts[postSave].editButtonShow = true;
      posts[postSave].formShow = false;
    }
  }

  render() {
    const { isLoading } = this.state;
    if (isLoading) {
      return <div>Loading...</div>
    }

    return <div style={{backgroundColor :'#F5F5F5'}}>
      <h1 className="text-center PostsClass">Posts</h1>
      <ul>
        {this.state.posts.map(el => (
          <li key={el.id} className="list-unstyled liClass" style={{backgroundColor: '#FFFAFA'}}>
            <div className="text-center titleClass"> {el.title} </div>
            <div className="text-center bodyClass">{el.body}</div>
            {el.editButtonShow ? 
              <button onClick={() => this.handleClick(el.id)} 
              style={{marginLeft:"95%"}}
              className="btn btn-outline-info">
              Edit</button> 
              : null}

              {el.formShow ?
                
                <div className="container">
                <hr />
                  <div className="form-group">
                    <input 
                      className="form-control no-border" 
                      type="text" 
                      onChange={this.handleChangeTitle}>
                    </input>
                  </div>
                  <div className="col-xs-3">
                    <textarea 
                      className="form-control no-border"
                      type="text" 
                      onChange={this.handleChangebody}>
                    </textarea>
                  </div>
                  
                  <button className="btn btn-outline-info saveButtonClass" onClick={() => this.saveData(el.id)}>save</button>
                </div> : null}

            <hr />
          </li>
        ))}
      </ul>
    </div>
  }
}
export default App;