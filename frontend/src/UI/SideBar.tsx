import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
  title: {
    fontSize: 22,
    position: 'absolute',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    textAlign: 'center',
    width: 30,
    display: 'block',
  },
  wrapper: {
    position: 'fixed',
    height: '100%',
    width: 50,
    backgroundColor: '#101010',
    zIndex: 50,
    paddingTop: 150,
  },
  list: {
    listStyle: 'none',
    padding: 0,
    marginLeft: 10,
    display: 'block',
    height: 40,
  },
});

interface IProps {
  list?: IData;
}

interface IData {
  matched: object[];
  alerts: object[];
}

const SideBar: React.FC<IProps> = (props: IProps) => {
  const classes = useStyles();

  const handleClick = (id: string) => {
    console.log(id);
  };

  return (
    <div className={classes.wrapper}>
      <ul style={{ padding: 0, margin: 0 }}>
        {props.list
          ? props.list.matched.map((m: any) => (
              <li className={classes.list} key={`list${m.letter}`}>
                <Typography
                  className={classes.title}
                  color='textSecondary'
                  gutterBottom
                >
                  <div
                    onClick={() => handleClick(m.letter)}
                    className={classes.link}
                  >
                    {m.letter}
                  </div>
                </Typography>
              </li>
            ))
          : null}
      </ul>
    </div>
  );
};

export default SideBar;
