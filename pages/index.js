import Head from 'next/head'
import Image from 'next/image'
import { Container, Box, Typography, TextField, Button, Alert, AlertTitle } from '@mui/material';
import { useRouter } from 'next/router'
import {CopyToClipboard} from 'react-copy-to-clipboard';

import { useState, useEffect } from 'react'

var codec = require('json-url')('lzw');

export default function Home() {

  let router = useRouter()

  const [values, setValues] = useState({
    source: '',
    medium: '',
    campaign: ''
  })
  const [string, setString] = useState('')
  const [link, setLink] = useState('')
  const [copied, setCopied] = useState(false)

  function handleChange(e) {
    const value = e.target.value;

    setValues({
      ...values,
      [e.target.name]: value
    });
  }

  function generateString() {
    let newString = '';
    // Loop the value object
    for (const [key, value] of Object.entries(values)) {
      // If this key has a value, add it to the string
      if (value) {
        // If we already have something in the string, seperate with &
        if (newString.length > 0) {
          newString = newString.concat("&")
        } else {
          newString = newString.concat("?")
        }
        newString = newString.concat("utm_" + key + "=" + value)
      }
    }
    setString(newString)
  }

  async function generateLink() {
    let result = await codec.compress(values)
    setLink(window.location.origin + "/n?q=" + result)
  }

  // Each time the values object updates, generate a new string
  useEffect(() => {
    generateString()
  }, [values])

  return (
    <>
      <Head>
        <title>Create UTM template</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Typography variant="h1">Create UTM template</Typography>
        <Box mb={2}>
          <TextField name="source" label="Source" variant="outlined" value={values.source} onChange={handleChange} />
          <TextField name="medium" label="Medium" variant="outlined" value={values.medium} onChange={handleChange} />
          <TextField name="campaign" label="Campaign" variant="outlined" value={values.campaign} onChange={handleChange} />
        </Box>
        <Typography>Preview: example.com{string}</Typography>
        <Button onClick={generateLink} variant="contained">Get template link</Button>

        {link &&
          <Box mt={2}>
            <Typography>Here is your link! Share it with anyone that needs a link with your UTM template</Typography>
            <Alert
              severity="success"
              action={
                <CopyToClipboard
                  text={link}
                  onCopy={() => setCopied(true)}
                >
                  <Button size="small" color="inherit">Copy</Button>
                </CopyToClipboard>
              }
            >
              {link}
            </Alert>
          </Box>
        }
      </Container>
    </>
  )
}
