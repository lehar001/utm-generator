import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { Container, Box, Typography, TextField, Button, Paper, Alert, AlertTitle, Grow } from '@mui/material';

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {CopyToClipboard} from 'react-copy-to-clipboard';

var codec = require('json-url')('lzw');

export default function N() {
  let router = useRouter()

  const [fields, setFields] = useState({
    source: {
      value: '',
      editable: false,
      options: []
    },
    medium: {
      value: '',
      editable: false,
      options: []
    },
    campaign: {
      value: '',
      editable: false,
      options: []
    }
  })
  const [link, setLink] = useState('')
  const [string, setString] = useState('')
  const [finalLink, setFinalLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [replaceSpace, setReplaceSpace] = useState(false)
  const [makeLowercase, setMakeLowercase] = useState(false)
  const [hasEditableField, setHasEditableField] = useState(false)

  function handleChange(e) {
    const value = e.target.value;
    setLink(value)
  }

  function generateString() {
    let newString = '';
    // Loop the value object
    for (const [key, value] of Object.entries(fields)) {
      // If any field is editable, set hasEditable
      if (value.editable) {
        setHasEditableField(true)
      }
      // If this field has a value, add it to the string
      if (value.value) {
        // Replace blank space, if that's chosen
        let formattedValue = value.value;
        if (replaceSpace) {
          formattedValue = formattedValue.replace(/ /g, replaceSpace)
        }
        if (makeLowercase) {
          formattedValue = formattedValue.toLowerCase();
        }
        // If we already have something in the string, seperate with &
        if (newString.length > 0) {
          newString = newString.concat("&")
        } else {
          newString = newString.concat("?")
        }
        newString = newString.concat("utm_" + key + "=" + formattedValue)
      }
    }
    setString(newString)
  }

  function handleEdit(e) {
    let field = fields[e.target.name];
    setFields({
      ...fields,
      [e.target.name]: {
        ...field,
        value: e.target.value
      }
    });
  }

  async function readParameters(query) {
    let q = await codec.decompress(query)
    setFields(q.fields)
    setReplaceSpace(q.replaceSpace)
    setMakeLowercase(q.makeLowercase)
  }

  // Check if there's a URL parameter called "query" present
  function useQuery() {
    return new URLSearchParams(router.query);
  }

  let query = useQuery();
  let incomingQuery = query.get("q");

  // On first load, get the values from query parameter
  useEffect(() => {
    if (incomingQuery) {
      readParameters(incomingQuery)
    }
  }, [incomingQuery])

  // Each time the values object updates, generate a new string
  useEffect(() => {
    generateString()
  }, [fields])

  useEffect(() => {
    setFinalLink(link + string)
  }, [string, link])

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <>
      <Head>
        <title>Generate UTM link from template</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Typography variant="h3">Generate UTM link from template</Typography>
        <Typography>Hey there! 👋</Typography>
        <Typography>So someone needs you to UTM tag a link and sent you here, huh?</Typography>
        <Typography>Do not worry, it is super simple! Just paste the link you want to use below and we will give you a new link back with the UTM-parameters added, just like whoever sent you here wanted.</Typography>
        <Paper
          sx={{
            p: 4
          }}
        >
          <Typography>Step 1 - Paste your destination link here.</Typography>
          <TextField fullWidth name="link" label="Paste your link here" variant="outlined" value={link} onChange={handleChange} />
        </Paper>
        {hasEditableField &&
          <Paper
            sx={{
              p: 4,
              mt: 2
            }}
          >
            <Typography>Step 2 - Make any edits you want.</Typography>
            {Object.keys(fields).map(key => {
              if(fields[key].editable) {
                return(
                  <TextField key={key} fullWidth name={key} label={capitalizeFirstLetter(key)} onChange={handleEdit} variant="outlined" value={fields[key].value} />
                )
              }
            }
            )}
          </Paper>
        }
        <Grow in={finalLink}>
          <Paper
            sx={{
              p: 4,
              mt: 2
            }}
          >
            <Typography>Step {hasEditableField ? "3" : "2"} - Here is your tagged link! Use it just like you would a normal link.</Typography>
            <Alert
              severity="success"
              action={
                <CopyToClipboard
                  text={finalLink}
                  onCopy={() => setCopied(true)}
                >
                  <Button size="small" color="inherit">{copied ? "Copied!" : "Copy"}</Button>
                </CopyToClipboard>
              }
            >
              {finalLink}
            </Alert>
          </Paper>
        </Grow>
        <Link href="/"><Button>Create your own template</Button></Link>
      </Container>
    </>
  )
}
