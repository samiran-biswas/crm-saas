import React, { useRef, useEffect, useState } from "react";
import { Layout, Menu, Button } from "antd";
import EmailEditor from "react-email-editor"; // Import EmailEditor

const { Header, Content, Sider } = Layout;

const TemplateLayout = () => {
  const emailEditorRef = useRef(null); // Create a ref for the EmailEditor
  const [editorLoaded, setEditorLoaded] = useState(false); // Track if editor is loaded

  // Initialize the editor when the component mounts
  const onLoad = () => {
    if (emailEditorRef.current && emailEditorRef.current.editor) {
      emailEditorRef.current.editor.loadDesign({
        "body": {
          "rows": [
            {
              "columns": [
                {
                  "contents": [
                    {
                      "type": "text",
                      "values": {
                        "content": "Welcome to your email editor!"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      });
    }
  };

  useEffect(() => {
    if (emailEditorRef.current) {
      setEditorLoaded(true); // Mark editor as loaded once the component is available
    }
  }, []);

  useEffect(() => {
    if (editorLoaded) {
      onLoad(); // Call onLoad only after editor is fully loaded
    }
  }, [editorLoaded]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
     
        

        <Layout style={{ padding: "24px" }}>
          {/* Content area using Ant Design's Content with Tailwind CSS padding */}
          <Content
            style={{
              padding: "24px",
              margin: 0,
              minHeight: 280,
              background: "#fff",
            }}
          >
            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-4"> Template Editor</h3>
              <div className="h-[500px]">
                <EmailEditor ref={emailEditorRef} /> {/* Render EmailEditor */}
              </div>
            </div>
          </Content>
        </Layout>
     
    </Layout>
  );
};

export default TemplateLayout;
