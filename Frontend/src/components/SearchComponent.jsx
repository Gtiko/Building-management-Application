import React from "react";

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchItem: "",
        };
    }

    handleSearchChange = (event) => {
        this.setState({ searchItem: event.target.value });
    };

    render() {
        const data = data;

        const rst = data.filter((item) => {
            return item.fName
                .toLowerCase()
                .includes(this.state.searchItem.toLowerCase());
        });

        return (
            <div>
                <center>
                    <input
                        type="search"
                        placeholder="Search"
                        value={this.state.searchItem}
                        onChange={this.handleSearchChange}
                    />
                </center>
                <center>
                    <div className="search">
                        {rst.map((item) => (
                            <div key={item.id}>
                                <div>Id: {item.id}</div>
                                <div>First Name: {item.fName}</div>
                                <div>Last Name: {item.lName}</div>
                                <div>Department: {item.department}</div>
                                <div>Role: {item.role}</div>
                            </div>
                        ))}
                    </div>
                </center>
            </div>
        );
    }
}

export default Search;
