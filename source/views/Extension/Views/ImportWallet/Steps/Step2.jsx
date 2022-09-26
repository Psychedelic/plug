import { Container, Button, TextInput, FormItem, UserIcon } from '@components'
import Grid from '@material-ui/core/Grid';
import useStyles from '../styles';
import React, { useState } from 'react'
import Picker from 'emoji-picker-react';
import { useEffect } from 'react';

const Step2 = () => {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [openEmojis, setOpenEmojis] = useState(false);
  const [walletName, setWalletName] = useState(''); // add deafault wallet name, for example the next wallet not used number
  const [currentEmoji, setCurrentEmoji] = useState('😎'); // add default emoji, not used in other wallets
  const [openEmojiSelector, setOpenEmojiSelector] = useState(false);

  const classes = useStyles();

  const onEmojiClick = (_event, emojiObject) => {
    setCurrentEmoji(emojiObject.emoji);
    setOpenEmojis(false);
    setOpenEmojiSelector(false);
  };

  useEffect(() => {
    if (walletName && walletName !== "") {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [currentEmoji, walletName]);


  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className={classes.chooseEmojiContainer}>
            <UserIcon icon={currentEmoji} size='big' />
            <Button
              variant="primary"
              value={'Edit Wallet Pic'}
              onClick={() => setOpenEmojiSelector(!openEmojiSelector)}
              style={{
                minWidth: 115,
                height: 24,
                borderRadius: 6,
              }}
            />
            {
              openEmojiSelector && (
                <Picker
                  pickerStyle={{
                    position: 'absolute',
                    zIndex: 500,
                    top: 180,
                  }}
                  onEmojiClick={onEmojiClick}
                  native
                  groupVisibility={{
                    recently_used: false,
                    flags: false,
                  }}
                />
              )
            }
          </div>
          <FormItem
            smallLabel
            label={'Name'}
            className={classes.formItem}
            component={(
              <TextInput
                fullWidth
                onChange={e => setWalletName(e.target.value)}
                type="text"
              // error={}
              />
            )}
          />
          <Button
            variant="rainbow"
            value="Save"
            onClick={() => console.log('Continueee')}
            loading={loading}
            disabled={!disabled}
            fullWidth
            data-testid="add-button"
          />
        </Grid>
      </Grid>
    </Container>
  )
}

export default Step2
