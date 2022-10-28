
import { Empty, SpinLoading } from "antd-mobile";
import "./index.css";

const QueryResult = ({ loading, error, data, children }) => {
  if (error) {
    return <p>ERROR: {error.message}</p>;
  }
  if (loading) {
    return (
      <div className="center-wrapper">
        <SpinLoading color='#56B43C' />
      </div>
    );
  }
  if (!data || data.length === 0) {
    return (
      <div className="center-wrapper">
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    );
  }
  if (data) {
    return children;
  }
};

export default QueryResult;
