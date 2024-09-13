import React, { useState } from 'react'
import SettingCard from '@renderer/components/base/base-setting-card'
import SettingItem from '@renderer/components/base/base-setting-item'
import { Button, Input, Switch } from '@nextui-org/react'
import { startSubStoreServer } from '@renderer/utils/ipc'
import { useAppConfig } from '@renderer/hooks/use-app-config'
import debounce from '@renderer/utils/debounce'
import { isValidCron } from 'cron-validator'

const SubStoreConfig: React.FC = () => {
  const { appConfig, patchAppConfig } = useAppConfig()
  const {
    useSubStore = true,
    useCustomSubStore = false,
    customSubStoreUrl,
    subStoreBackendSyncCron,
    subStoreBackendDownloadCron,
    subStoreBackendUploadCron
  } = appConfig || {}

  const [customSubStoreUrlValue, setCustomSubStoreUrlValue] = useState(customSubStoreUrl)
  const setCustomSubStoreUrl = debounce(async (v: string) => {
    await patchAppConfig({ customSubStoreUrl: v })
  }, 500)
  const [subStoreBackendSyncCronValue, setSubStoreBackendSyncCronValue] =
    useState(subStoreBackendSyncCron)
  const [subStoreBackendDownloadCronValue, setSubStoreBackendDownloadCronValue] = useState(
    subStoreBackendDownloadCron
  )
  const [subStoreBackendUploadCronValue, setSubStoreBackendUploadCronValue] =
    useState(subStoreBackendUploadCron)
  return (
    <SettingCard title="Sub-Store 设置">
      <SettingItem title="启用 Sub-Store" divider>
        <Switch
          size="sm"
          isSelected={useSubStore}
          onValueChange={async (v) => {
            try {
              await patchAppConfig({ useSubStore: v })
              if (v) await startSubStoreServer()
            } catch (e) {
              alert(e)
            }
          }}
        />
      </SettingItem>
      {useSubStore && (
        <SettingItem title="使用自建 Sub-Store 后端" divider>
          <Switch
            size="sm"
            isSelected={useCustomSubStore}
            onValueChange={async (v) => {
              try {
                await patchAppConfig({ useCustomSubStore: v })
                if (!v) await startSubStoreServer()
              } catch (e) {
                alert(e)
              }
            }}
          />
        </SettingItem>
      )}
      {useCustomSubStore ? (
        <SettingItem title="自建 Sub-Store 后端地址">
          <Input
            size="sm"
            className="w-[60%]"
            value={customSubStoreUrlValue}
            placeholder="必须包含协议头"
            onValueChange={(v: string) => {
              setCustomSubStoreUrlValue(v)
              setCustomSubStoreUrl(v)
            }}
          />
        </SettingItem>
      ) : (
        <>
          <SettingItem title="定时同步订阅/文件" divider>
            <div className="flex w-[60%] gap-2">
              {subStoreBackendSyncCronValue !== subStoreBackendSyncCron && (
                <Button
                  size="sm"
                  color="primary"
                  onPress={async () => {
                    if (
                      !subStoreBackendSyncCronValue ||
                      isValidCron(subStoreBackendSyncCronValue)
                    ) {
                      await patchAppConfig({
                        subStoreBackendSyncCron: subStoreBackendSyncCronValue
                      })
                      new Notification('重启应用生效')
                    } else {
                      alert('Cron 表达式无效')
                    }
                  }}
                >
                  确认
                </Button>
              )}
              <Input
                size="sm"
                className="flex-grown"
                value={subStoreBackendSyncCronValue}
                placeholder="Cron 表达式"
                onValueChange={(v: string) => {
                  setSubStoreBackendSyncCronValue(v)
                }}
              />
            </div>
          </SettingItem>
          <SettingItem title="定时恢复配置" divider>
            <div className="flex w-[60%] gap-2">
              {subStoreBackendDownloadCronValue !== subStoreBackendDownloadCron && (
                <Button
                  size="sm"
                  color="primary"
                  onPress={async () => {
                    if (
                      !subStoreBackendDownloadCronValue ||
                      isValidCron(subStoreBackendDownloadCronValue)
                    ) {
                      await patchAppConfig({
                        subStoreBackendDownloadCron: subStoreBackendDownloadCronValue
                      })
                      new Notification('重启应用生效')
                    } else {
                      alert('Cron 表达式无效')
                    }
                  }}
                >
                  确认
                </Button>
              )}
              <Input
                size="sm"
                className="flex-grown"
                value={subStoreBackendDownloadCronValue}
                placeholder="Cron 表达式"
                onValueChange={(v: string) => {
                  setSubStoreBackendDownloadCronValue(v)
                }}
              />
            </div>
          </SettingItem>
          <SettingItem title="定时备份配置">
            <div className="flex w-[60%] gap-2">
              {subStoreBackendUploadCronValue !== subStoreBackendUploadCron && (
                <Button
                  size="sm"
                  color="primary"
                  onPress={async () => {
                    if (
                      !subStoreBackendUploadCronValue ||
                      isValidCron(subStoreBackendUploadCronValue)
                    ) {
                      await patchAppConfig({
                        subStoreBackendUploadCron: subStoreBackendUploadCronValue
                      })
                      new Notification('重启应用生效')
                    } else {
                      alert('Cron 表达式无效')
                    }
                  }}
                >
                  确认
                </Button>
              )}
              <Input
                size="sm"
                className="flex-grown"
                value={subStoreBackendUploadCronValue}
                placeholder="Cron 表达式"
                onValueChange={(v: string) => {
                  setSubStoreBackendUploadCronValue(v)
                }}
              />
            </div>
          </SettingItem>
        </>
      )}
    </SettingCard>
  )
}

export default SubStoreConfig