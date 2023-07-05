type Filename = {
  basename: string
  extension: string
}

function splitFilename(name: string): Filename {
  const dotIndex = name.lastIndexOf('.')

  if (dotIndex > 0 && dotIndex < name.length - 1) {
    return {
      basename: name.slice(0, dotIndex),
      extension: name.slice(dotIndex + 1),
    }
  } else {
    return {
      basename: name,
      extension: '',
    }
  }
}

export default splitFilename
