import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  ListGroup,
  CardSubtitle,
  ListGroupItem,
  Button,
} from 'reactstrap';
import user from "@/src/assets/images/users/user2.jpg";
import Image from 'next/image';
import moment from 'moment';

const Feeds = ({FeedData}) => {
  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">Users</CardTitle>
        <CardSubtitle className="mb-2 text-muted" tag="h6">
          Overview of all the users
        </CardSubtitle>
        <ListGroup flush className="mt-4">
          {FeedData.map((feed) => (
            <ListGroupItem
              key={feed._id}
              action
              tag="a"
              className="d-flex align-items-center p-3 border-0"
            >
              <button className="rounded-circle me-3" size="sm" >
                <Image src={user} width={50} height={50} className='rounded-circle'/>
              </button>
              {feed.name}
              <small className="ms-auto text-muted text-small">{moment(feed.createdAt).calendar()}</small>
            </ListGroupItem>
          ))}
        </ListGroup>
      </CardBody>
    </Card>
  );
};

export default Feeds;
