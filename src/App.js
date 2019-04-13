import React, { Component } from "react";
import styles from "./App.css"

const Profile = (props) => {
  return (
    <div className="profile">
      <div className="userpic">
        <img src={props.profile.avatar_url} style={{ width: "100px" }} />
      </div>
      <div className="user-info">
        <p>{props.profile.name}</p>
        <p>{props.profile.company ? props.profile.company : "Lone Wolf"}</p>

      </div>
    </div>
  )
}
class Form extends Component {
  state = {
    username: ""
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = await fetch(`https://api.github.com/users/${this.state.username}`, { method: "GET" })
      this.setState({ username: "" })
      if (data.ok) {
        const json = await data.json()
        if (!json) {
          return;
        } else if (this.props.profiles === undefined) {
          this.props.onSubmit(json);
        }
        else if (this.props.profiles.find(profile => profile.id === json.id)) {
          return;
        } else {
          this.props.onSubmit(json);
          this.props.error("")
        }
      } else {
        throw data
      }
    }
    catch (data) {
      this.props.error(data.statusText);
    }
  }

  render() {
    return <form onSubmit={this.handleSubmit}>
      <input type="text" value={this.state.username} onChange={(e) => this.setState({ username: e.target.value })} placeholder="Github username" required />
      <button>Add profile</button>
    </form>
  }
}

const ProfileList = (props) => {
  return (
    props.profiles.map(profile => <Profile profile={profile} key={profile.id} />)
  )
}

class App extends Component {
  constructor(props) {
    super()
    this.state = {
      profiles: [],
      error: ""
    }
  }

  addNewProfile = (profileData) => {
    this.setState(prevState => ({
      profiles: [...prevState.profiles, profileData]
    })
    )
  }

  handleError = (error) => {
    this.setState({
      error
    })
  }

  render() {
    return (
      <div className="App">
        <h1>The Github Profiles App</h1>
        {/* Figure this one out */}
        <h6>{this.state.error ? this.state.error : ""}</h6>
        <Form onSubmit={this.addNewProfile} profiles={this.state.profiles} error={this.handleError} />
        <ProfileList profiles={this.state.profiles} />
      </div>
    )
  }
}


export default App;
